import React from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';

interface Props {
  collection: Collection;
}

function NFTDropPage({ collection }: Props) {

  // Auth
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  // ---

  console.log(address)
  return (
    <div className="flex flex-col w-full h-screen lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-purple-600 rounded-xl">
            <img 
              className="object-cover w-44 rounded-xl lg:h-96 lg:w-72" 
              src={urlFor(collection.previewImage).url()} alt="" 
            />
          </div>
          <div className="p-5 space-y-6 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftname}
            </h1>
            <h2 className="text-xl text-gray-300">
              {collection.description}
            </h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col flex-1 p-12 lg:col-span-6">
        {/* Header */}
          <header className="flex items-center justify-between">
            <Link href={'/'}>
              <h1 className="text-xl cursor-pointer w-52 font-extralight sm:w-80">
                The 
                {' '}
                <span className="font-extrabold underline decoration-pink-600/50">
                  T3CNYKAL
                </span>
                {' '}
                NFT Market Place
              </h1>
            </Link>
            <button 
              onClick={() => address ? disconnect() : connectWithMetamask()}
              className="px-4 py-2 text-xs font-bold text-white rounded-full bg-rose-400 lg:px-5 lg:py-3">
              {address ? 'Sign Out' : 'Sign In'}
            </button>
          </header>

          <hr className="my-2 border" />
          {address && (
            <p className="text-sm text-center text-rose-400">
              You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}</p>
          )}

        {/* Content */}

        <div className="flex flex-col items-center flex-1 mt-10 space-y-6 text-center lg:justify-center lg:space-y-0">
          <img 
            className="object-cover pb-10 w-80 lg:h-40" 
            src={urlFor(collection.mainImage).url()} 
            alt="" />
            <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
            </h1>

            <p className="pt-2 text-xl text-green-500">
              13 / 21 NFT's claimed
            </p>
        </div>

        {/* Mint Button */}
        <button 
          className="w-full h-16 mt-10 font-bold text-white bg-red-600 rounded-full">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
    *[_type == "collection" && slug.current == $id][0] {
      _id,
      title,
      address,
      description,
      nftname,
      mainImage {
        asset
      },
      previewImage {
        asset
      },
      slug {
        current
      },
      creator-> {
        _id,
        name,
        address,
        slug {
          current
        },
      }
    }
  `;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if(!collection) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      collection
    }
  }
}