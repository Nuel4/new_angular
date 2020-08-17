export class ReferringPhysician {
    ReferringPhysicianId: number;
    ReferringPhysicianFirstName: string;
    ReferringPhysicianLastName: string;
    SpecialtyDetails: string;
    RelatedOrganizationId: number;
    RelatedOrganization: {RelatedOrganizationId: number, RelatedOrganizationName: string};
    MainPhone: string
    AltPhone: string;
    MobilePhone: string;
    Fax: string;
    Email: string;
    Website: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    StateCode: string;
    ZipCode: string;
    ZipPlus4: string;
    DateCreated: string;
    CreatedByUserId: number;
    DateLastUpdated: string;
    LastUpdatedByUserId: number;
    NationalProviderIdentifier: string;
    IsActive?: boolean;
}
