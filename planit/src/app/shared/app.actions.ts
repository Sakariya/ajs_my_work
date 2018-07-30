import { Action } from '@ngrx/store';
export const LOGIN = '[app] Login';
export const LOGOUT = '[app] Logout';
export const SET_CLIENT = '[app] Set Client';
export const SET_GOAL = '[goal] Set Goal';
export const SET_DOCUMENTS = '[documents] Set Documents';
export const SET_PORTFOLIO = '[portfolio] Set Portfolio';
export const SET_ALLOC = '[alloc] Set Alloc';
export const SET_TASKS = '[tasks] Set Tasks';
export const SET_CLIENT_ADDRESS = '[clientAddress] Set ClientAddress';
export const SET_NETWORTHINVESTMENT = '[networthInvestment] Set NetworthInvesment';
export const SET_FAMILY_MEMBERS = '[familyMembers] Set FamilyMembers';
export const SET_FAMILY_MEMBERS_RISK = '[FamilyMembersRisk] Set FamilyMembersRisk';
export const SET_CLIENT_PROGRESS = '[SET_CLIENT_PROGRESS] Set SET_CLIENT_PROGRESS';
export const SET_ADVISOR_WORKFLOW = '[SET_ADVISOR_WORKFLOW] Set SET_ADVISOR_WORKFLOW';
export const SET_BEHAVIOURAL_RISK_TOLERANCE = '[SET_BEHAVIOURAL_RISK_TOLERANCE] Set SET_BEHAVIOURAL_RISK_TOLERANCE';
export const SET_KYC_ANSWERS = '[SET_KYC_ANSWERS] Set SET_KYC_ANSWERS';
export const SET_KYC_QUESTIONS = '[SET_KYC_QUESTIONS] Set SET_KYC_QUESTIONS';
export const SET_ADVISOR_NETWORTHINVESTMENT = '[advisorNetworthInvestment] Set AdvisorNetworthInvesment';
export const SET_ADVISOR_CLIENT = '[SET_ADVISOR_CLIENT] set SET_ADVISOR_CLIENT';
export const SET_ADVISOR_TASKNOTIFICATION = '[advisorTaskNotification] Set AdvisorTaskNotification';
export const SET_ADVISOR_DEMOGRAPHICS = '[advisorDemographic] Set AdvisorDemographic';
export const SET_ADVISOR_DOCUMENT = '[setAdvisorDocument] Set setAdvisorDocument';
export const SET_ADVISOR_COLLABORATION = '[advisorCollaboration] Set AdvisorCollaboration';
export const SET_ADVISOR_SUITABILITY = '[advisorSuitability] Set AdvisorSuitability';
export const SET_CLIENT_DOCUMENT_CENTRE = '[clientDocumentCentre] Set ClientDocumentCentre';
export const SET_CLIENT_DOCUMENT_TYPE = '[clientDocumentType] Set ClientDocumentType';
export const SET_CLIENT_PORTFOLIO_LIST = '[setClientPortfolioList] Set setClientPortfolioList';
export const SET_TEMPLATE_LIST = '[setTemplateList] Set setTemplateList';
export const SET_PLANNING_SUMMARY = '[SET_PLANNING_SUMMARY] Set setPlanningSummary';
export const SET_HOLDING_ASSET_LIABILITY = '[setHoldingAssetLiability] Set setHoldingAssetLiability';
export const SET_UTILITY_ASSET_LIABILITY_DETAILS = '[setUtilityAssetLiabilityDetails] Set setUtilityAssetLiabilityDetails';
export const SET_ACCOUNT_SUMMARY_LIST = '[setAccountSummaryList] Set setAccountSummaryList';
export const SET_UTILITY_PRODUCT_SEARCH = '[setUtilityProductSearch] Set setUtilityProductSearch';
export const SET_FAVOURITE_LIST = '[setFavouritList] Set setFavouritList';
export const SET_SAVINGS_DETAILS = '[setSavingsDetails] Set setSavingsDetails';
export class Login implements Action {
    readonly type = LOGIN;
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class SetClient implements Action {
    readonly type = SET_CLIENT;
    constructor(public clientPayload: any) { }
}

export class SetGoal implements Action {
    readonly type = SET_GOAL;
    constructor(public goalPayload: any[]) { }
}

export class SetDocuments implements Action {
    readonly type = SET_DOCUMENTS;
    constructor(public documentPayload: any[]) { }
}

export class SetTasks implements Action {
    readonly type = SET_TASKS;
    constructor(public taskPayload: any[]) { }
}

export class SetAlloc implements Action {
    readonly type = SET_ALLOC;
    constructor(public allocPayload: any) { }
}

export class SetNetworthInvestment implements Action {
    readonly type = SET_NETWORTHINVESTMENT;
    constructor(public networthInvestmentPayload: any) { }
}

export class SetPortfolio implements Action {
    readonly type = SET_PORTFOLIO;
    constructor(public portfolioPayload: any[]) { }
}

export class SetClientAddress implements Action {
    readonly type = SET_CLIENT_ADDRESS;
    constructor(public clientAddressPayload: any) { }
}

export class SetFamilyMembers implements Action {
    readonly type = SET_FAMILY_MEMBERS;
    constructor(public familyMemberPayload: any) { }
}

export class SetFamilyMembersRisk implements Action {
    readonly type = SET_FAMILY_MEMBERS_RISK;
    constructor(public familyMemberRiskPayload: any) { }
}

export class SetClientProgress implements Action {
    readonly type = SET_CLIENT_PROGRESS;
    constructor(public clientProgressPayload: any) { }
}

export class SetAdvisorWorkflow implements Action {
    readonly type = SET_ADVISOR_WORKFLOW;
    constructor(public advisorWorkflowPayload: any) { }
}

export class SetAdvisorNetworthInvesment implements Action {
    readonly type = SET_ADVISOR_NETWORTHINVESTMENT;
    constructor(public advisorNetworthInvestmentPayload: any) { }
}

export class SetBehaviouralRiskTolerance implements Action {
    readonly type = SET_BEHAVIOURAL_RISK_TOLERANCE;
    constructor(public behaviouralRiskTolerancePayLoad: any) { }
}

export class SetKycAnswers implements Action {
    readonly type = SET_KYC_ANSWERS;
    constructor(public kycAnswersPayLoad: any) { }
}

export class SetKycQuestions implements Action {
    readonly type = SET_KYC_QUESTIONS;
    constructor(public kycQuestionsPayLoad: any) { }
}

export class SetAdvisorClient implements Action {
    readonly type = SET_ADVISOR_CLIENT;
    constructor(public advisorClientPayload: any) { }
}

export class SetAdvisorTaskNotification implements Action {
    readonly type = SET_ADVISOR_TASKNOTIFICATION;
    constructor(public advisorTaskNotificationPayload: any) { }
}

export class SetAdvisorDemographic implements Action {
    readonly type = SET_ADVISOR_DEMOGRAPHICS;
    constructor(public advisorDemographicPayload: any) { }
}

export class SetAdvisorDocument implements Action {
    readonly type = SET_ADVISOR_DOCUMENT;
    constructor(public advisorDocumentPayload: any) { }
}

export class SetAdvisorCollaboration implements Action {
    readonly type = SET_ADVISOR_COLLABORATION;
    constructor(public advisorCollaborationPayload: any) { }
}

export class SetAdvisorSuitability implements Action {
    readonly type = SET_ADVISOR_SUITABILITY;
    constructor(public advisorSuitabilityPayload: any) { }
}

export class SetClientDocumentCentre implements Action {
    readonly type = SET_CLIENT_DOCUMENT_CENTRE;
    constructor(public clientDocumentCentrePayload: any) { }
}

export class SetClientDocumentType implements Action {
    readonly type = SET_CLIENT_DOCUMENT_TYPE;
    constructor(public clientDocumentTypePayload: any) { }
}

export class SetClientPortfolioList implements Action {
    readonly type = SET_CLIENT_PORTFOLIO_LIST;
    constructor(public clientPortfolioListPayload: any) { }
}

export class SetTemplateList implements Action {
    readonly type = SET_TEMPLATE_LIST;
    constructor(public TemplateListPayload: any) { }
}

export class SetPlanningSummary implements Action {
    readonly type = SET_PLANNING_SUMMARY;
    constructor(public planningSummaryPayload: any) { }
}

export class SetHoldingAssetLiability implements Action {
    readonly type = SET_HOLDING_ASSET_LIABILITY;
    constructor(public holdingAssetLiabilityPayload: any) { }
}

export class SetUtilityAssetLiabilityDetails implements Action {
    readonly type = SET_UTILITY_ASSET_LIABILITY_DETAILS;
    constructor(public utilityAssetLiabilityDetailsPayload: any) { }
}

export class SetAccountSummaryList implements Action {
    readonly type = SET_ACCOUNT_SUMMARY_LIST;
    constructor(public accountSummaryListPayload: any) { }
}

export class SetUtilityProductSearch implements Action {
    readonly type = SET_UTILITY_PRODUCT_SEARCH;
    constructor(public utilityProductSearchPayload: any) { }
}
export class SetFavouriteList implements Action {
    readonly type = SET_FAVOURITE_LIST;
    constructor(public favouriteListPayload: any) { }
}
export class SetSavingsDetails implements Action {
    readonly type = SET_SAVINGS_DETAILS;
    constructor(public savingsDetailsPayload: any) { }
}

export type AppActions =
    | Login
    | Logout
    | SetClient
    | SetGoal
    | SetDocuments
    | SetAlloc
    | SetTasks
    | SetPortfolio
    | SetNetworthInvestment
    | SetClientAddress
    | SetFamilyMembers
    | SetFamilyMembersRisk
    | SetClientProgress
    | SetAdvisorWorkflow
    | SetBehaviouralRiskTolerance
    | SetKycAnswers
    | SetKycQuestions
    | SetAdvisorNetworthInvesment
    | SetAdvisorClient
    | SetAdvisorTaskNotification
    | SetAdvisorDemographic
    | SetAdvisorDocument
    | SetAdvisorCollaboration
    | SetAdvisorSuitability
    | SetClientDocumentCentre
    | SetClientDocumentType
    | SetClientPortfolioList
    | SetTemplateList
    | SetPlanningSummary
    | SetHoldingAssetLiability
    | SetUtilityAssetLiabilityDetails
    | SetAccountSummaryList
    | SetUtilityProductSearch
    | SetFavouriteList
    | SetSavingsDetails;
