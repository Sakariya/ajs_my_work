export class FamilyMember {
    id: string;
    relation: number;
    title: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    preferredName: string;
    governmentID: string;
    email: string;
    mobilePhone: string;
    retired: string;
    initials: string;
    avatar: string;
    risk: string;
    kyc: string;
    self: string;
    riskInviteStatus: number;
    docInviteStatus: number;
}


export let Relation: any = [
    { id: 1, name: 'Client 1'},
    { id: 2, name: 'Spouse' },
    { id: 4, name: 'Son' },
    { id: 5, name: 'Daughter' },
    { id: 6, name: 'Brother' },
    { id: 7, name: 'Sister' },
    { id: 8, name: 'Mother' },
    { id: 9, name: 'Father' },
    { id: 10, name: 'Grandson' },
    { id: 11, name: 'Granddaughter' },
    { id: 3, name: 'Other dependant' },
];
export let Titles: any = [
    { name: 'Mr.' },
    { name: 'Mrs.' },
    { name: 'Dr.' },
    { name: 'Miss.' }
];


export let MaritalStatus: any = [
    { id: 1, name: 'Married' },
    { id: 2, name: 'Single' },
    { id: 3, name: 'Common law' },
    { id: 4, name: 'Divorced' },
    { id: 5, name: 'Widowed' },
    { id: 6, name: 'Separated' },
    { id: 7, name: 'Married/Single' }
];

