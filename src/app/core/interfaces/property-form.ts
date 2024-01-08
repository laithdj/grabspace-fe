export interface PropertyForm {
  title: string;
  address: string;
  salePrice: number;
  sellerContactNumber: string;
  description: string;
  rentYield: number;
  weeklyCurrentRent: number;
  weeeklyRentalAppraisal: number;
  propertyValueGrowth: number;
  propertyAge: number;
  currentlyTenanted: boolean;
  currentlyTenantedValue: number;
  rentalMarketPrice: number;
  vacancyRate: number;
  floodZone: boolean;
  fireZone: boolean;
  images: Array<{
    imageName: string;
    originalFileName: string;
    mimeType: string;
  }>;
  landSize: number;
  landDAApproved: boolean;
  isBodyCorporate: boolean;
  bodyCorporateValue: number;
}
