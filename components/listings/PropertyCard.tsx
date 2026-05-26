import Image from "next/image";
import type { Property } from "@/types/property";
import FavoriteButton from "./FavoriteButton";
import {
  formatBaths,
  formatPrice,
  formatArea,
  formatListDate,
} from "@/lib/format";

interface PropertyCardProps {
  property: Property;
}

/**
 * A single listing card: photo with favorite overlay, then specs, price,
 * address, and list date.
 */
export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    mlsId,
    listPrice,
    listDate,
    address,
    property: details,
    photos,
  } = property;
  const { bedrooms, bathsFull, bathsHalf, area } = details;
  const photo = photos?.[0];
  const headingId = `property-${mlsId}-address`;

  return (
    <article className="flex flex-col" aria-labelledby={headingId}>
      <div className="relative">
        {photo ? (
          <Image
            className="h-[240px] w-full rounded-sm object-cover"
            src={photo}
            // Decorative: the address is conveyed by the heading below, so an
            // empty alt avoids the screen reader announcing it twice.
            alt=""
            width={300}
            height={240}
          />
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center rounded-sm bg-gray-200 text-sm text-gray-600">
            No photo available
          </div>
        )}
        <FavoriteButton mlsId={mlsId} />
      </div>

      <div className="py-3">
        <p className="mb-1 mt-0">
          {bedrooms} BR | {formatBaths(bathsFull, bathsHalf)} Bath |{" "}
          {formatArea(area)} Sq Ft
        </p>
        <p className="mb-1 mt-0 text-xl font-bold">{formatPrice(listPrice)}</p>
        {/* Heading identifies the card in the listings list for screen readers.
            Tailwind's preflight neutralizes default heading styles, so visual size
            is controlled entirely by the classes below. */}
        <h2
          id={headingId}
          className="mb-1 mt-0 text-base font-normal text-[#333]"
        >
          {address.full}
        </h2>
        <p className="m-0 text-sm text-gray-500">
          Listed: {formatListDate(listDate)}
        </p>
      </div>
    </article>
  );
}
