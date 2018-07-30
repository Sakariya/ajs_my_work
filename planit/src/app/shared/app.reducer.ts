import { FamilyPayload } from '../api.service';

import {
    LOGIN,
    LOGOUT,
    SET_CLIENT,
    AppActions,
    SET_GOAL,
    SetClient,
    SetGoal,
    SET_DOCUMENTS,
    SetDocuments,
    SetPortfolio,
    SET_PORTFOLIO,
    SetAlloc,
    SET_ALLOC,
    SET_TASKS,
    SetTasks,
    SetNetworthInvestment,
    SET_NETWORTHINVESTMENT,
    SET_CLIENT_ADDRESS,
    SetClientAddress,
    SET_FAMILY_MEMBERS,
    SetFamilyMembers,
    SET_FAMILY_MEMBERS_RISK,
    SetFamilyMembersRisk,
    SET_CLIENT_PROGRESS,
    SetClientProgress,
    SetAdvisorWorkflow,
    SET_ADVISOR_WORKFLOW,
    SET_BEHAVIOURAL_RISK_TOLERANCE,
    SetBehaviouralRiskTolerance,
    SET_KYC_ANSWERS,
    SetKycAnswers,
    SET_KYC_QUESTIONS,
    SetKycQuestions,
    SET_ADVISOR_NETWORTHINVESTMENT,
    SetAdvisorNetworthInvesment,
    SET_ADVISOR_CLIENT,
    SetAdvisorClient,
    SetAdvisorTaskNotification,
    SET_ADVISOR_TASKNOTIFICATION,
    SET_ADVISOR_DEMOGRAPHICS,
    SET_ADVISOR_DOCUMENT,
    SetAdvisorDemographic,
    SetAdvisorDocument,
    SET_ADVISOR_COLLABORATION,
    SET_ADVISOR_SUITABILITY,
    SetAdvisorCollaboration,
    SetAdvisorSuitability,
    SetClientDocumentCentre,
    SET_CLIENT_DOCUMENT_CENTRE,
    SET_CLIENT_DOCUMENT_TYPE,
    SetClientDocumentType,
    SetClientPortfolioList,
    SET_CLIENT_PORTFOLIO_LIST,
    SetPlanningSummary,
    SET_PLANNING_SUMMARY,
    SET_TEMPLATE_LIST,
    SET_HOLDING_ASSET_LIABILITY,
    SetHoldingAssetLiability,
    SET_UTILITY_ASSET_LIABILITY_DETAILS,
    SetUtilityAssetLiabilityDetails,
    SetAccountSummaryList,
    SET_ACCOUNT_SUMMARY_LIST,
    SET_UTILITY_PRODUCT_SEARCH,
    SetUtilityProductSearch,
    SetFavouriteList,
    SET_FAVOURITE_LIST,
    SET_SAVINGS_DETAILS,
    SetSavingsDetails


} from './app.actions';

import {
    Action,
    ActionReducerMap,
    createFeatureSelector,
    createSelector
} from '@ngrx/store';

import { TokenStorage } from './token.storage';
import { ProfileProgress } from '../client/client-models';

export interface AppState {
    isLoggedIn: boolean;
    clientPayload: FamilyPayload;
    isClientLoaded: boolean;
    goalPayload: any[];
    isGoalLoaded: boolean;
    documentPayloads: any[];
    isDocumentsLoaded: boolean;
    portfolioPayload: any[];
    isPortfolioLoaded: boolean;
    isAllocationLoaded: boolean;
    allocationPayload: any;
    isTaskLoaded: boolean;
    taskPayloads: any[];
    networthInvestmentPayload: any;
    isNetworthInvestmentLoaded: boolean;
    clientAddressPayload: any;
    familyMemberPayload: any;
    familyMemberRiskPayload: any;
    isClientProgressLoaded: boolean;
    clientProgressPayload: ProfileProgress;
    advisorWorkflowPayload: any;
    isAdvisorLoaded: boolean;
    behaviouralRiskTolerancePayLoad: any;
    kycAnswersPayLoad: any;
    kycQuestionsPayLoad: any;
    advisorNetworthInvestmentPayload: any;
    isAdvisorNetworthInvestmentLoaded: boolean;
    advisorClientPayload: any;
    isAdvisorTaskNotificationPayload: boolean;
    isAdvisorClientLoaded: boolean;
    advisorTaskNotificationPayload: any;
    isAdvisorDemographicLoaded: boolean;
    advisorDemographicPayload: any;
    isAdvisorDocumentLoaded: boolean;
    advisorDocumentPayload: any;
    isAdvisorCollaborationPayload: boolean;
    advisorCollaborationPayload: any;
    isAdvisorSuitabilityPayload: boolean;
    advisorSuitabilityPayload: any;
    isClientDocumentCentrePayload: boolean;
    clientDocumentCentrePayload: any;
    isClientDocumentTypeLoaded: boolean;
    clientDocumentTypePayload: any;
    isClientPortfolioListLoaded: boolean;
    clientPortfolioListPayload: any;
    isTemplateListLoaded: boolean;
    TemplateListPayload: any;
    isPlanningSummaryLoaded: boolean;
    planningSummaryPayload: any;
    isHoldingAssetLiabilityLoaded: boolean;
    holdingAssetLiabilityPayload: any;
    isUtilityAssetLiabilityDetailsLoaded: boolean;
    utilityAssetLiabilityDetailsPayload: any;
    isAccountSummaryListLoaded: boolean;
    accountSummaryListPayload: any;
    isUtilityProductSearchLoaded: boolean;
    utilityProductSearchPayload: any;
    isfavouriteListLoaded: boolean;
    favouriteListPayload: any;
    isSavingsDetailsLoaded: boolean;
    savingsDetailsPayload: any;
}

const initialState: AppState = {
    // isLoggedIn: (TokenStorage.exists) ? true : false,
    isLoggedIn: (new TokenStorage().getToken('MockAuthToken')) ? true : false,
    clientPayload: { person: [], address: {} },
    isClientLoaded: false,
    goalPayload: [],
    isGoalLoaded: false,
    documentPayloads: [],
    isDocumentsLoaded: false,
    portfolioPayload: [],
    isPortfolioLoaded: false,
    isAllocationLoaded: false,
    allocationPayload: null,
    isTaskLoaded: false,
    taskPayloads: [],
    networthInvestmentPayload: null,
    isNetworthInvestmentLoaded: false,
    clientAddressPayload: {},
    familyMemberPayload: {},
    familyMemberRiskPayload: {},
    isClientProgressLoaded: false,
    clientProgressPayload: new ProfileProgress(),
    advisorWorkflowPayload: {},
    isAdvisorLoaded: false,
    behaviouralRiskTolerancePayLoad: {},
    kycAnswersPayLoad: {},
    kycQuestionsPayLoad: {},
    advisorNetworthInvestmentPayload: {},
    isAdvisorNetworthInvestmentLoaded: false,
    advisorClientPayload: {},
    advisorTaskNotificationPayload: {},
    isAdvisorTaskNotificationPayload: false,
    isAdvisorClientLoaded: false,
    isAdvisorDemographicLoaded: false,
    advisorDemographicPayload: [],
    isAdvisorDocumentLoaded: false,
    advisorDocumentPayload: [],
    isAdvisorCollaborationPayload: false,
    advisorCollaborationPayload: {},
    isAdvisorSuitabilityPayload: false,
    advisorSuitabilityPayload: null,
    isClientDocumentCentrePayload: false,
    clientDocumentCentrePayload: null,
    isClientDocumentTypeLoaded: false,
    clientDocumentTypePayload: [],
    isClientPortfolioListLoaded: false,
    clientPortfolioListPayload: [],
    isTemplateListLoaded: false,
    TemplateListPayload: [],
    isPlanningSummaryLoaded: false,
    planningSummaryPayload: null,
    isHoldingAssetLiabilityLoaded: false,
    holdingAssetLiabilityPayload: [],
    isUtilityAssetLiabilityDetailsLoaded: false,
    utilityAssetLiabilityDetailsPayload: null,
    isAccountSummaryListLoaded: false,
    accountSummaryListPayload: null,
    isUtilityProductSearchLoaded: false,
    utilityProductSearchPayload: null,
    isfavouriteListLoaded: false,
    favouriteListPayload: null,
    isSavingsDetailsLoaded: false,
    savingsDetailsPayload: null
};

export interface State {
    app: AppState;
}

export function appReducer(state: AppState = initialState, action: AppActions) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isLoggedIn: true
            };
        case LOGOUT:
            return initialState;
        case SET_CLIENT:
            return {
                ...state,
                isClientLoaded: true,
                clientPayload: (<SetClient>action).clientPayload
            };
        case SET_GOAL:
            return {
                ...state,
                isGoalLoaded: true,
                goalPayload: (<SetGoal>action).goalPayload
            };
        case SET_DOCUMENTS:
            return {
                ...state,
                isDocumentsLoaded: true,
                documentPayloads: (<SetDocuments>action).documentPayload
            };
        case SET_PORTFOLIO:
            return {
                ...state,
                isPortfolioLoaded: true,
                portfolioPayload: (<SetPortfolio>action).portfolioPayload
            };
        case SET_ALLOC:
            return {
                ...state,
                isAllocationLoaded: true,
                allocationPayload: (<SetAlloc>action).allocPayload
            };
        case SET_TASKS:
            return {
                ...state,
                isTaskLoaded: true,
                taskPayloads: (<SetTasks>action).taskPayload
            };
        case SET_NETWORTHINVESTMENT:
            return {
                ...state,
                isNetworthInvestmentLoaded: true,
                networthInvestmentPayload: (<SetNetworthInvestment>action).networthInvestmentPayload
            };
        case SET_CLIENT_ADDRESS:
            return {
                ...state,
                isClientLoaded: true,
                clientAddressPayload: (<SetClientAddress>action).clientAddressPayload
            };
        case SET_FAMILY_MEMBERS:
            return {
                ...state,
                isClientLoaded: true,
                familyMemberPayload: (<SetFamilyMembers>action).familyMemberPayload
            };
        case SET_FAMILY_MEMBERS_RISK:
            return {
                ...state,
                isClientLoaded: true,
                familyMemberRiskPayload: (<SetFamilyMembersRisk>action).familyMemberRiskPayload
            };
        case SET_CLIENT_PROGRESS:
            return {
                ...state,
                isClientProgressLoaded: true,
                clientProgressPayload: (<SetClientProgress>action).clientProgressPayload
            };
        case SET_ADVISOR_WORKFLOW:
            return {
                ...state,
                isAdvisorLoaded: true,
                advisorWorkflowPayload: (<SetAdvisorWorkflow>action).advisorWorkflowPayload
            };
        case SET_BEHAVIOURAL_RISK_TOLERANCE:
            return {
                ...state,
                isAdvisorLoaded: true,
                behaviouralRiskTolerancePayLoad: (<SetBehaviouralRiskTolerance>action).behaviouralRiskTolerancePayLoad
            };
        case SET_KYC_ANSWERS:
            return {
                ...state,
                kycAnswersPayLoad: (<SetKycAnswers>action).kycAnswersPayLoad
            };
        case SET_KYC_QUESTIONS:
            return {
                ...state,
                kycQuestionsPayLoad: (<SetKycQuestions>action).kycQuestionsPayLoad
            };
        case SET_ADVISOR_NETWORTHINVESTMENT:
            return {
                ...state,
                isAdvisorNetworthInvestmentLoaded: true,
                advisorNetworthInvestmentPayload: (<SetAdvisorNetworthInvesment>action).advisorNetworthInvestmentPayload
            };
        case SET_ADVISOR_CLIENT:
            return {
                ...state,
                isAdvisorClientLoaded: true,
                advisorClientPayload: (<SetAdvisorClient>action).advisorClientPayload
            };
        case SET_ADVISOR_TASKNOTIFICATION:
            return {
                ...state,
                isAdvisorTaskNotificationPayload: true,
                advisorTaskNotificationPayload: (<SetAdvisorTaskNotification>action).advisorTaskNotificationPayload
            };
        case SET_ADVISOR_DEMOGRAPHICS:
            return {
                ...state,
                isAdvisorDemographicLoaded: true,
                advisorDemographicPayload: (<SetAdvisorDemographic>action).advisorDemographicPayload
            };
        case SET_ADVISOR_DOCUMENT:
            return {
                ...state,
                isAdvisorDocumentLoaded: true,
                advisorDocumentPayload: (<SetAdvisorDocument>action).advisorDocumentPayload

            };
        case SET_ADVISOR_COLLABORATION:
            return {
                ...state,
                isAdvisorCollaborationPayload: true,
                advisorCollaborationPayload: (<SetAdvisorCollaboration>action).advisorCollaborationPayload
            };
        case SET_ADVISOR_SUITABILITY:
            return {
                ...state,
                isAdvisorSuitabilityPayload: true,
                advisorSuitabilityPayload: (<SetAdvisorSuitability>action).advisorSuitabilityPayload
            };
        case SET_CLIENT_DOCUMENT_CENTRE:
            return {
                ...state,
                isClientDocumentCentrePayload: true,
                clientDocumentCentrePayload: (<SetClientDocumentCentre>action).clientDocumentCentrePayload
            };
        case SET_CLIENT_DOCUMENT_TYPE:
            return {
                ...state,
                isClientDocumentTypeLoaded: true,
                clientDocumentTypePayload: (<SetClientDocumentType>action).clientDocumentTypePayload
            };
        case SET_CLIENT_PORTFOLIO_LIST:
            return {
                ...state,
                isClientPortfolioListLoaded: true,
                clientPortfolioListPayload: (<SetClientPortfolioList>action).clientPortfolioListPayload
            };
        case SET_PLANNING_SUMMARY:
            return {
                ...state,
                isPlanningSummaryLoaded: true,
                planningSummaryPayload: (<SetPlanningSummary>action).planningSummaryPayload
            };
        case SET_HOLDING_ASSET_LIABILITY:
            return {
                ...state,
                isHoldingAssetLiabilityLoaded: true,
                holdingAssetLiabilityPayload: (<SetHoldingAssetLiability>action).holdingAssetLiabilityPayload
            };
        case SET_UTILITY_ASSET_LIABILITY_DETAILS:
            return {
                ...state,
                isUtilityAssetLiabilityDetailsLoaded: true,
                utilityAssetLiabilityDetailsPayload: (<SetUtilityAssetLiabilityDetails>action).utilityAssetLiabilityDetailsPayload
            };
        case SET_ACCOUNT_SUMMARY_LIST:
            return {
                ...state,
                isAccountSummaryListLoaded: true,
                accountSummaryListPayload: (<SetAccountSummaryList>action).accountSummaryListPayload
            };
        case SET_UTILITY_PRODUCT_SEARCH:
            return {
                ...state,
                isUtilityProductSearchLoaded: true,
                utilityProductSearchPayload: (<SetUtilityProductSearch>action).utilityProductSearchPayload
            };

        case SET_FAVOURITE_LIST:
            return {
                ...state,
                isfavouriteListLoaded: true,
                favouriteListPayload: (<SetFavouriteList>action).favouriteListPayload
            };
        case SET_SAVINGS_DETAILS:
            return {
                ...state,
                isSavingsDetails: true,
                savingsDetailsPayload: (<SetSavingsDetails>action).savingsDetailsPayload

            };
        default:
            return state;
    }
}

export const reducers: ActionReducerMap<State> = {
    app: appReducer
};

export const getAppState = createFeatureSelector<AppState>('app');

export const getIsLoggedIn = createSelector(
    getAppState,
    (state: AppState) => state.isLoggedIn
);

export const getClientPayload = createSelector(
    getAppState,
    (state: AppState) => state.clientPayload
);

export const getIsClientLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isClientLoaded
);

export const getIsGoalLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isGoalLoaded
);

export const getGoalPayload = createSelector(
    getAppState,
    (state: AppState) => state.goalPayload
);

export const getIsDocumentLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isDocumentsLoaded
);

export const getDocumentPayloads = createSelector(
    getAppState,
    (state: AppState) => state.documentPayloads
);

export const getIsPortfolioLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isPortfolioLoaded
);
export const getPortfolioPayload = createSelector(
    getAppState,
    (state: AppState) => state.portfolioPayload
);

export const getAllocPayload = createSelector(
    getAppState,
    (state: AppState) => state.allocationPayload
);

export const getIsAllocLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isAllocationLoaded
);
export const getIsTaskLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isTaskLoaded
);

export const getTaskPayloads = createSelector(
    getAppState,
    (state: AppState) => state.taskPayloads
);
export const getIsNetworthInvestmentLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isNetworthInvestmentLoaded
);

export const getNetworthInvestmentPayload = createSelector(
    getAppState,
    (state: AppState) => state.networthInvestmentPayload
);

export const getClientAddressPayload = createSelector(
    getAppState,
    (state: AppState) => state.clientAddressPayload
);

export const getFamilyMemberPayload = createSelector(
    getAppState,
    (state: AppState) => state.familyMemberPayload
);

export const getFamilyMemberRiskPayload = createSelector(
    getAppState,
    (state: AppState) => state.familyMemberRiskPayload
);

export const getIsClientProgressLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isClientProgressLoaded
);

export const getClientProgressPayload = createSelector(
    getAppState,
    (state: AppState) => state.clientProgressPayload
);
export const getIsAdvisorLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorLoaded
);
export const getAdvisorWorkflowPayload = createSelector(
    getAppState,
    (state: AppState) => state.advisorWorkflowPayload
);

export const getBehaviouralRiskTolerancePayLoad = createSelector(
    getAppState,
    (state: AppState) => state.behaviouralRiskTolerancePayLoad
);

export const getkycAnswersPayLoad = createSelector(
    getAppState,
    (state: AppState) => state.kycAnswersPayLoad
);
export const getkycQuestionsPayLoad = createSelector(
    getAppState,
    (state: AppState) => state.kycQuestionsPayLoad
);

export const getIsAdvisorNetworthInvestmentLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorNetworthInvestmentLoaded
);

export const getAdvisorNetworthInvestmentPayload = createSelector(
    getAppState,
    (state: AppState) => state.advisorNetworthInvestmentPayload
);

export const getAdvisorClientPayLoad = createSelector(
    getAppState,
    (state: AppState) => state.advisorClientPayload
);

export const getAdvisorTaskNotificationPayload = createSelector(
    getAppState,
    (state: AppState) => state.advisorTaskNotificationPayload
);

export const getIsAdvisorTaskNotificationPayload = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorTaskNotificationPayload
);
export const getIsAdvisorClientLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorClientLoaded
);
export const getIsAdvisorDemographicLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorDemographicLoaded
);
export const getAdvisorDemographicPayload = createSelector(
    getAppState,
    (state: AppState) => state.advisorDemographicPayload
);
export const getAdvisorDocument = createSelector(
    getAppState,
    (state: AppState) => state.advisorDocumentPayload
);
export const getIsAdvisorDocument = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorDocumentLoaded
);
export const getAdvisorCollaborationPayload = createSelector(
    getAppState,
    (state: AppState) => state.advisorCollaborationPayload
);

export const getIsAdvisorCollaborationPayload = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorCollaborationPayload
);

export const getAdvisorSuitabilityPayload = createSelector(
    getAppState,
    (state: AppState) => state.advisorSuitabilityPayload
);

export const getIsAdvisorSuitabilityPayload = createSelector(
    getAppState,
    (state: AppState) => state.isAdvisorSuitabilityPayload
);

export const getClientDocumentCentrePayload = createSelector(
    getAppState,
    (state: AppState) => state.clientDocumentCentrePayload
);

export const getIsClientDocumentCentrePayload = createSelector(
    getAppState,
    (state: AppState) => state.isClientDocumentCentrePayload
);

export const getIsClientDocumentTypeLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isClientDocumentTypeLoaded
);

export const getclientDocumentTypePayload = createSelector(
    getAppState,
    (state: AppState) => state.clientDocumentTypePayload
);

export const getIsClientPortfolioListLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isClientPortfolioListLoaded
);

export const getClientPortfolioListPayload = createSelector(
    getAppState,
    (state: AppState) => state.clientPortfolioListPayload
);

export const getIsTemplateListLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isTemplateListLoaded
);

export const getTemplateListLoaded = createSelector(
    getAppState,
    (state: AppState) => state.TemplateListPayload
);

export const getIsPlanningSummaryLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isPlanningSummaryLoaded
);

export const getPlanningSummaryPayload = createSelector(
    getAppState,
    (state: AppState) => state.planningSummaryPayload
);

export const getIsholdingAssetLiabilityLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isHoldingAssetLiabilityLoaded
);

export const getholdingAssetLiabilityPayload = createSelector(
    getAppState,
    (state: AppState) => state.holdingAssetLiabilityPayload
);

export const getIsUtilityAssetLiabilityDetailsLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isUtilityAssetLiabilityDetailsLoaded
);

export const getUtilityAssetLiabilityDetailsPayload = createSelector(
    getAppState,
    (state: AppState) => state.utilityAssetLiabilityDetailsPayload
);

export const getIsAccountSummaryListLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isAccountSummaryListLoaded
);

export const getAccountSummaryListPayload = createSelector(
    getAppState,
    (state: AppState) => state.accountSummaryListPayload
);

export const getIsUtilityProductSearchLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isUtilityProductSearchLoaded
);

export const getUtilityProductSearchPayload = createSelector(
    getAppState,
    (state: AppState) => state.utilityProductSearchPayload
);


export const getIsFavouriteListLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isfavouriteListLoaded
);

export const getFavouriteListPayload = createSelector(
    getAppState,
    (state: AppState) => state.favouriteListPayload
);
export const getIsSavingsDetailsLoaded = createSelector(
    getAppState,
    (state: AppState) => state.isSavingsDetailsLoaded
);

export const getSavingsDetailsPayload = createSelector(
    getAppState,
    (state: AppState) => state.savingsDetailsPayload

);
