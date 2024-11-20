import { environment } from "../environments/environment";

const betaAmazonS3URL = environment.amazonS3LiveURL;

export const getImageUrl = (image: string): string => {
  return betaAmazonS3URL + image;
};
