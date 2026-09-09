"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Building, Library, GraduationCap, Users, Home, Utensils, Heart, FlaskConical } from "lucide-react";

interface Location {
  id: string;
  name: string;
  type: string;
  coordinates: string;
  description?: string;
}

interface MapVisualizationProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export default function MapVisualization({ locations, onLocationSelect }: MapVisualizationProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  }, [selectedLocation, onLocationSelect]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "building":
        return <Building className="size-4 text-primary" />;
      case "department":
        return <Home className="size-4 text-accent" />;
      case "classroom":
        return <GraduationCap className="size-4 text-secondary" />;
      case "lab":
        return <FlaskConical className="size-4 text-destructive" />;
      case "library":
        return <Library className="size-4 text-success" />;
      case "cafeteria":
        return <Utensils className="size-4 text-warning" />;
      case "auditorium":
        return <Users className="size-4 text-info" />;
      case "service":
        return <Heart className="size-4 text-muted" />;
      default:
        return <MapPin className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Campus background */}
        <rect width="800" height="600" fill="var(--surface)" rx="8" />

        {/* Campus roads */}
        <path d="M50 300 Q200 250 350 300 T700 350" stroke="var(--border)" strokeWidth="4" fill="none" />
        <path d="M350 50 Q400 100 450 150 T700 200" stroke="var(--border)" strokeWidth="4" fill="none" />
        <path d="M50 300 Q200 350 350 400 T700 450" stroke="var(--border)" strokeWidth="4" fill="none" />

        {/* Campus buildings */}
        {locations.map((location) => {
          const [x, y] = location.coordinates.split(",").map(Number);
          return (
            <g
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <circle cx={x} cy={y} r="12" fill="var(--glass)" stroke="var(--glass-border)" strokeWidth="1" />
              <foreignObject x={x - 10} y={y - 10} width="20" height="20">
                {getLocationIcon(location.type)}
              </foreignObject>
              {selectedLocation?.id === location.id && (
                <text x={x} y={y + 25} textAnchor="middle" fontSize="10" fill="var(--foreground)">
                  {location.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
