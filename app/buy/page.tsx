import Navigation from "@/components/nav";
import React from 'react';
import './styles.css';
import PropertyBox from './PropertyBox'
import Collapse from "./collapse";
import PropertyCard from "./property-card";
import { demo } from "@/utils/demo";

export default async function Page() {

  return (
    <div>
        <Navigation />
        <div>
        <Collapse />
        </div>
        <div className="title text-center">
            Listed properties
        </div>
        <div className=" pl-4 pr-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    demo.properties.map((property, i) => {
                        return (
                            <PropertyCard key={i} property={property} role='BUYER' />
                        )
                    })
                }
            </div>
        </div>
        <div className="no-more">
            - You have reached the end of the page -
        </div>
    </div>
    
  );
}