import { useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import ListingsMap from "@/components/listings/ListingsMap";
import PropertyList from "@/components/listings/PropertyList";
import { useProperties, type MapBounds } from "@/hooks/useProperties";

/**
 * Property Listings — the landing page. Composes the layout shell, map, and list.
 * Map bounds live here so the map can update them and the list can react.
 *
 * Additional pages would live alongside this one under `pages/` and reuse the
 * shared <Layout> / <Header> chrome.
 */
export default function Listings() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const { properties, loading, error } = useProperties(bounds);

  return (
    <>
      <Head>
        <title>Property Listings</title>
      </Head>
      <Layout
        title="Property Listings"
        map={<ListingsMap properties={properties} onBoundsChange={setBounds} />}
        list={
          <PropertyList
            properties={properties}
            loading={loading}
            error={error}
          />
        }
      />
    </>
  );
}
