/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: clients
 * Interface for Clients
 */
export interface Clients {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType image */
  clientImage?: string;
  /** @wixFieldType text */
  clientDescription?: string;
  /** @wixFieldType text */
  clientDesignation?: string;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType url */
  websiteUrl?: string;
}


/**
 * Collection ID: contactsubmissions
 * Interface for ContactSubmissions
 */
export interface ContactSubmissions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  mobileNumber?: string;
  /** @wixFieldType text */
  city?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
}


/**
 * Collection ID: newslettersubscribers
 * Interface for NewsletterSubscribers
 */
export interface NewsletterSubscribers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType datetime */
  subscriptionDate?: Date | string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType text */
  source?: string;
  /** @wixFieldType text */
  notes?: string;
}


/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectName?: string;
  /** @wixFieldType image */
  projectImage?: string;
  /** @wixFieldType text */
  briefDescription?: string;
  /** @wixFieldType text */
  detailedDescription?: string;
  /** @wixFieldType text */
  category?: string;
}
