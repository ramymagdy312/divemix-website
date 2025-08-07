"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  working_hours?: Record<string, string>;
  is_active: boolean;
  display_order: number;
}

interface BranchListProps {
  branches: Branch[];
  className?: string;
}

const BranchList: React.FC<BranchListProps> = ({
  branches,
  className = "",
}) => {
  const openInGoogleMaps = (branch: Branch) => {
    if (branch.map_url) {
      window.open(branch.map_url, "_blank");
    } else if (branch.latitude && branch.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;
      window.open(url, "_blank");
    }
  };

  const getDirections = (branch: Branch) => {
    if (branch.latitude && branch.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
      window.open(url, "_blank");
    } else if (branch.map_url) {
      window.open(branch.map_url, "_blank");
    }
  };

  if (branches.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No branches available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Our Locations</span>
            </CardTitle>
            <CardDescription>
              Visit us at any of our convenient locations
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {branches.length} {branches.length === 1 ? "Location" : "Locations"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <Card key={branch.id} className="border-l-4 border-l-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">
                      {branch.name}
                    </h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {branch.address}
                        </span>
                      </div>

                      {branch.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                          <a
                            href={`tel:${branch.phone}`}
                            className="text-primary hover:underline"
                          >
                            {branch.phone}
                          </a>
                        </div>
                      )}

                      {branch.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                          <a
                            href={`mailto:${branch.email}`}
                            className="text-primary hover:underline"
                          >
                            {branch.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {(branch.latitude && branch.longitude) || branch.map_url ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => getDirections(branch)}
                          className="text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openInGoogleMaps(branch)}
                          className="text-xs"
                        >
                          View on Map
                        </Button>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Map not available
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchList;
