// @ts-nocheck
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  ActionResponseDto,
  AdRewardDto,
  AuthResponseDto,
  BusinessIdDto,
  BuyBusinessDto,
  BuyPropertyDto,
  BuyVehicleDto,
  CollectInvestmentDto,
  GameStateResponseDto,
  HustleDto,
  InvestDto,
  LeaderboardControllerGetLeaderboardParams,
  LeaderboardResponseDto,
  LoanDto,
  LoginDto,
  MeResponseDto,
  ResearchDto,
  ResolveEventDto,
  SignupDto,
  SpendBossCoinsDto
} from './schemas';

import { customFetch } from '../customFetch';
import type { ErrorType , BodyType } from '../customFetch';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getAppControllerGetHelloUrl = () => {




  return `/`
}

export const appControllerGetHello = async ( options?: RequestInit): Promise<string> => {

  return customFetch<string>(getAppControllerGetHelloUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAppControllerGetHelloQueryKey = () => {
    return [
    `/`
    ] as const;
    }


export const getAppControllerGetHelloQueryOptions = <TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAppControllerGetHelloQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof appControllerGetHello>>> = ({ signal }) => appControllerGetHello({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AppControllerGetHelloQueryResult = NonNullable<Awaited<ReturnType<typeof appControllerGetHello>>>
export type AppControllerGetHelloQueryError = ErrorType<unknown>


export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHello>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHello>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHello>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHello>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAppControllerGetHelloQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerSignupUrl = () => {




  return `/api/signup`
}

export const authControllerSignup = async (signupDto: SignupDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerSignupUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(signupDto)
  }
);}




export const getAuthControllerSignupMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext> => {

const mutationKey = ['authControllerSignup'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerSignup>>, {data: BodyType<SignupDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerSignup(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerSignupMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerSignup>>>
    export type AuthControllerSignupMutationBody = BodyType<SignupDto>
    export type AuthControllerSignupMutationError = ErrorType<unknown>

    export const useAuthControllerSignup = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerSignup>>,
        TError,
        {data: BodyType<SignupDto>},
        TContext
      > => {
      return useMutation(getAuthControllerSignupMutationOptions(options), queryClient);
    }

export const getAuthControllerLoginUrl = () => {




  return `/api/auth/login`
}

export const authControllerLogin = async (loginDto: LoginDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(loginDto)
  }
);}




export const getAuthControllerLoginMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext> => {

const mutationKey = ['authControllerLogin'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerLogin>>, {data: BodyType<LoginDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerLogin(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerLoginMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerLogin>>>
    export type AuthControllerLoginMutationBody = BodyType<LoginDto>
    export type AuthControllerLoginMutationError = ErrorType<unknown>

    export const useAuthControllerLogin = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerLogin>>,
        TError,
        {data: BodyType<LoginDto>},
        TContext
      > => {
      return useMutation(getAuthControllerLoginMutationOptions(options), queryClient);
    }

export const getAuthControllerMeUrl = () => {




  return `/api/auth/me`
}

export const authControllerMe = async ( options?: RequestInit): Promise<MeResponseDto> => {

  return customFetch<MeResponseDto>(getAuthControllerMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerMeQueryKey = () => {
    return [
    `/api/auth/me`
    ] as const;
    }


export const getAuthControllerMeQueryOptions = <TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerMe>>> = ({ signal }) => authControllerMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerMeQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerMe>>>
export type AuthControllerMeQueryError = ErrorType<unknown>


export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerMeQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getGameControllerGetStateUrl = () => {




  return `/api/game/state`
}

export const gameControllerGetState = async ( options?: RequestInit): Promise<GameStateResponseDto> => {

  return customFetch<GameStateResponseDto>(getGameControllerGetStateUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGameControllerGetStateQueryKey = () => {
    return [
    `/api/game/state`
    ] as const;
    }


export const getGameControllerGetStateQueryOptions = <TData = Awaited<ReturnType<typeof gameControllerGetState>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof gameControllerGetState>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGameControllerGetStateQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof gameControllerGetState>>> = ({ signal }) => gameControllerGetState({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof gameControllerGetState>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GameControllerGetStateQueryResult = NonNullable<Awaited<ReturnType<typeof gameControllerGetState>>>
export type GameControllerGetStateQueryError = ErrorType<unknown>


export function useGameControllerGetState<TData = Awaited<ReturnType<typeof gameControllerGetState>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof gameControllerGetState>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof gameControllerGetState>>,
          TError,
          Awaited<ReturnType<typeof gameControllerGetState>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGameControllerGetState<TData = Awaited<ReturnType<typeof gameControllerGetState>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof gameControllerGetState>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof gameControllerGetState>>,
          TError,
          Awaited<ReturnType<typeof gameControllerGetState>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGameControllerGetState<TData = Awaited<ReturnType<typeof gameControllerGetState>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof gameControllerGetState>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGameControllerGetState<TData = Awaited<ReturnType<typeof gameControllerGetState>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof gameControllerGetState>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGameControllerGetStateQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getGameControllerHustleUrl = () => {




  return `/api/game/hustle`
}

export const gameControllerHustle = async (hustleDto: HustleDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerHustleUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(hustleDto)
  }
);}




export const getGameControllerHustleMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerHustle>>, TError,{data: BodyType<HustleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerHustle>>, TError,{data: BodyType<HustleDto>}, TContext> => {

const mutationKey = ['gameControllerHustle'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerHustle>>, {data: BodyType<HustleDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerHustle(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerHustleMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerHustle>>>
    export type GameControllerHustleMutationBody = BodyType<HustleDto>
    export type GameControllerHustleMutationError = ErrorType<unknown>

    export const useGameControllerHustle = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerHustle>>, TError,{data: BodyType<HustleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerHustle>>,
        TError,
        {data: BodyType<HustleDto>},
        TContext
      > => {
      return useMutation(getGameControllerHustleMutationOptions(options), queryClient);
    }

export const getGameControllerBuyBusinessUrl = () => {




  return `/api/game/business/buy`
}

export const gameControllerBuyBusiness = async (buyBusinessDto: BuyBusinessDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerBuyBusinessUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(buyBusinessDto)
  }
);}




export const getGameControllerBuyBusinessMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyBusiness>>, TError,{data: BodyType<BuyBusinessDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyBusiness>>, TError,{data: BodyType<BuyBusinessDto>}, TContext> => {

const mutationKey = ['gameControllerBuyBusiness'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerBuyBusiness>>, {data: BodyType<BuyBusinessDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerBuyBusiness(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerBuyBusinessMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerBuyBusiness>>>
    export type GameControllerBuyBusinessMutationBody = BodyType<BuyBusinessDto>
    export type GameControllerBuyBusinessMutationError = ErrorType<unknown>

    export const useGameControllerBuyBusiness = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyBusiness>>, TError,{data: BodyType<BuyBusinessDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerBuyBusiness>>,
        TError,
        {data: BodyType<BuyBusinessDto>},
        TContext
      > => {
      return useMutation(getGameControllerBuyBusinessMutationOptions(options), queryClient);
    }

export const getGameControllerUpgradeBusinessUrl = () => {




  return `/api/game/business/upgrade`
}

export const gameControllerUpgradeBusiness = async (businessIdDto: BusinessIdDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerUpgradeBusinessUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(businessIdDto)
  }
);}




export const getGameControllerUpgradeBusinessMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerUpgradeBusiness>>, TError,{data: BodyType<BusinessIdDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerUpgradeBusiness>>, TError,{data: BodyType<BusinessIdDto>}, TContext> => {

const mutationKey = ['gameControllerUpgradeBusiness'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerUpgradeBusiness>>, {data: BodyType<BusinessIdDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerUpgradeBusiness(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerUpgradeBusinessMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerUpgradeBusiness>>>
    export type GameControllerUpgradeBusinessMutationBody = BodyType<BusinessIdDto>
    export type GameControllerUpgradeBusinessMutationError = ErrorType<unknown>

    export const useGameControllerUpgradeBusiness = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerUpgradeBusiness>>, TError,{data: BodyType<BusinessIdDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerUpgradeBusiness>>,
        TError,
        {data: BodyType<BusinessIdDto>},
        TContext
      > => {
      return useMutation(getGameControllerUpgradeBusinessMutationOptions(options), queryClient);
    }

export const getGameControllerHireUrl = () => {




  return `/api/game/business/hire`
}

export const gameControllerHire = async (businessIdDto: BusinessIdDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerHireUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(businessIdDto)
  }
);}




export const getGameControllerHireMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerHire>>, TError,{data: BodyType<BusinessIdDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerHire>>, TError,{data: BodyType<BusinessIdDto>}, TContext> => {

const mutationKey = ['gameControllerHire'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerHire>>, {data: BodyType<BusinessIdDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerHire(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerHireMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerHire>>>
    export type GameControllerHireMutationBody = BodyType<BusinessIdDto>
    export type GameControllerHireMutationError = ErrorType<unknown>

    export const useGameControllerHire = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerHire>>, TError,{data: BodyType<BusinessIdDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerHire>>,
        TError,
        {data: BodyType<BusinessIdDto>},
        TContext
      > => {
      return useMutation(getGameControllerHireMutationOptions(options), queryClient);
    }

export const getGameControllerBuyPropertyUrl = () => {




  return `/api/game/property/buy`
}

export const gameControllerBuyProperty = async (buyPropertyDto: BuyPropertyDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerBuyPropertyUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(buyPropertyDto)
  }
);}




export const getGameControllerBuyPropertyMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyProperty>>, TError,{data: BodyType<BuyPropertyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyProperty>>, TError,{data: BodyType<BuyPropertyDto>}, TContext> => {

const mutationKey = ['gameControllerBuyProperty'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerBuyProperty>>, {data: BodyType<BuyPropertyDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerBuyProperty(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerBuyPropertyMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerBuyProperty>>>
    export type GameControllerBuyPropertyMutationBody = BodyType<BuyPropertyDto>
    export type GameControllerBuyPropertyMutationError = ErrorType<unknown>

    export const useGameControllerBuyProperty = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyProperty>>, TError,{data: BodyType<BuyPropertyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerBuyProperty>>,
        TError,
        {data: BodyType<BuyPropertyDto>},
        TContext
      > => {
      return useMutation(getGameControllerBuyPropertyMutationOptions(options), queryClient);
    }

export const getGameControllerBuyVehicleUrl = () => {




  return `/api/game/vehicle/buy`
}

export const gameControllerBuyVehicle = async (buyVehicleDto: BuyVehicleDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerBuyVehicleUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(buyVehicleDto)
  }
);}




export const getGameControllerBuyVehicleMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyVehicle>>, TError,{data: BodyType<BuyVehicleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyVehicle>>, TError,{data: BodyType<BuyVehicleDto>}, TContext> => {

const mutationKey = ['gameControllerBuyVehicle'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerBuyVehicle>>, {data: BodyType<BuyVehicleDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerBuyVehicle(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerBuyVehicleMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerBuyVehicle>>>
    export type GameControllerBuyVehicleMutationBody = BodyType<BuyVehicleDto>
    export type GameControllerBuyVehicleMutationError = ErrorType<unknown>

    export const useGameControllerBuyVehicle = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerBuyVehicle>>, TError,{data: BodyType<BuyVehicleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerBuyVehicle>>,
        TError,
        {data: BodyType<BuyVehicleDto>},
        TContext
      > => {
      return useMutation(getGameControllerBuyVehicleMutationOptions(options), queryClient);
    }

export const getGameControllerResearchUrl = () => {




  return `/api/game/invest/research`
}

export const gameControllerResearch = async (researchDto: ResearchDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerResearchUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(researchDto)
  }
);}




export const getGameControllerResearchMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerResearch>>, TError,{data: BodyType<ResearchDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerResearch>>, TError,{data: BodyType<ResearchDto>}, TContext> => {

const mutationKey = ['gameControllerResearch'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerResearch>>, {data: BodyType<ResearchDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerResearch(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerResearchMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerResearch>>>
    export type GameControllerResearchMutationBody = BodyType<ResearchDto>
    export type GameControllerResearchMutationError = ErrorType<unknown>

    export const useGameControllerResearch = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerResearch>>, TError,{data: BodyType<ResearchDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerResearch>>,
        TError,
        {data: BodyType<ResearchDto>},
        TContext
      > => {
      return useMutation(getGameControllerResearchMutationOptions(options), queryClient);
    }

export const getGameControllerInvestUrl = () => {




  return `/api/game/invest`
}

export const gameControllerInvest = async (investDto: InvestDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerInvestUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(investDto)
  }
);}




export const getGameControllerInvestMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerInvest>>, TError,{data: BodyType<InvestDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerInvest>>, TError,{data: BodyType<InvestDto>}, TContext> => {

const mutationKey = ['gameControllerInvest'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerInvest>>, {data: BodyType<InvestDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerInvest(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerInvestMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerInvest>>>
    export type GameControllerInvestMutationBody = BodyType<InvestDto>
    export type GameControllerInvestMutationError = ErrorType<unknown>

    export const useGameControllerInvest = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerInvest>>, TError,{data: BodyType<InvestDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerInvest>>,
        TError,
        {data: BodyType<InvestDto>},
        TContext
      > => {
      return useMutation(getGameControllerInvestMutationOptions(options), queryClient);
    }

export const getGameControllerCollectInvestmentUrl = () => {




  return `/api/game/invest/collect`
}

export const gameControllerCollectInvestment = async (collectInvestmentDto: CollectInvestmentDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerCollectInvestmentUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(collectInvestmentDto)
  }
);}




export const getGameControllerCollectInvestmentMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerCollectInvestment>>, TError,{data: BodyType<CollectInvestmentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerCollectInvestment>>, TError,{data: BodyType<CollectInvestmentDto>}, TContext> => {

const mutationKey = ['gameControllerCollectInvestment'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerCollectInvestment>>, {data: BodyType<CollectInvestmentDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerCollectInvestment(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerCollectInvestmentMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerCollectInvestment>>>
    export type GameControllerCollectInvestmentMutationBody = BodyType<CollectInvestmentDto>
    export type GameControllerCollectInvestmentMutationError = ErrorType<unknown>

    export const useGameControllerCollectInvestment = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerCollectInvestment>>, TError,{data: BodyType<CollectInvestmentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerCollectInvestment>>,
        TError,
        {data: BodyType<CollectInvestmentDto>},
        TContext
      > => {
      return useMutation(getGameControllerCollectInvestmentMutationOptions(options), queryClient);
    }

export const getGameControllerResolveEventUrl = () => {




  return `/api/game/event/resolve`
}

export const gameControllerResolveEvent = async (resolveEventDto: ResolveEventDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerResolveEventUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(resolveEventDto)
  }
);}




export const getGameControllerResolveEventMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerResolveEvent>>, TError,{data: BodyType<ResolveEventDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerResolveEvent>>, TError,{data: BodyType<ResolveEventDto>}, TContext> => {

const mutationKey = ['gameControllerResolveEvent'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerResolveEvent>>, {data: BodyType<ResolveEventDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerResolveEvent(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerResolveEventMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerResolveEvent>>>
    export type GameControllerResolveEventMutationBody = BodyType<ResolveEventDto>
    export type GameControllerResolveEventMutationError = ErrorType<unknown>

    export const useGameControllerResolveEvent = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerResolveEvent>>, TError,{data: BodyType<ResolveEventDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerResolveEvent>>,
        TError,
        {data: BodyType<ResolveEventDto>},
        TContext
      > => {
      return useMutation(getGameControllerResolveEventMutationOptions(options), queryClient);
    }

export const getGameControllerClaimDailyUrl = () => {




  return `/api/game/daily/claim`
}

export const gameControllerClaimDaily = async ( options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerClaimDailyUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getGameControllerClaimDailyMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerClaimDaily>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerClaimDaily>>, TError,void, TContext> => {

const mutationKey = ['gameControllerClaimDaily'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerClaimDaily>>, void> = () => {


          return  gameControllerClaimDaily(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerClaimDailyMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerClaimDaily>>>

    export type GameControllerClaimDailyMutationError = ErrorType<unknown>

    export const useGameControllerClaimDaily = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerClaimDaily>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerClaimDaily>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getGameControllerClaimDailyMutationOptions(options), queryClient);
    }

export const getGameControllerCollectOfflineUrl = () => {




  return `/api/game/collect-offline`
}

export const gameControllerCollectOffline = async ( options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerCollectOfflineUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getGameControllerCollectOfflineMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerCollectOffline>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerCollectOffline>>, TError,void, TContext> => {

const mutationKey = ['gameControllerCollectOffline'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerCollectOffline>>, void> = () => {


          return  gameControllerCollectOffline(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerCollectOfflineMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerCollectOffline>>>

    export type GameControllerCollectOfflineMutationError = ErrorType<unknown>

    export const useGameControllerCollectOffline = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerCollectOffline>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerCollectOffline>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getGameControllerCollectOfflineMutationOptions(options), queryClient);
    }

export const getGameControllerTakeLoanUrl = () => {




  return `/api/game/loan/take`
}

export const gameControllerTakeLoan = async (loanDto: LoanDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerTakeLoanUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(loanDto)
  }
);}




export const getGameControllerTakeLoanMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerTakeLoan>>, TError,{data: BodyType<LoanDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerTakeLoan>>, TError,{data: BodyType<LoanDto>}, TContext> => {

const mutationKey = ['gameControllerTakeLoan'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerTakeLoan>>, {data: BodyType<LoanDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerTakeLoan(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerTakeLoanMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerTakeLoan>>>
    export type GameControllerTakeLoanMutationBody = BodyType<LoanDto>
    export type GameControllerTakeLoanMutationError = ErrorType<unknown>

    export const useGameControllerTakeLoan = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerTakeLoan>>, TError,{data: BodyType<LoanDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerTakeLoan>>,
        TError,
        {data: BodyType<LoanDto>},
        TContext
      > => {
      return useMutation(getGameControllerTakeLoanMutationOptions(options), queryClient);
    }

export const getGameControllerRepayLoanUrl = () => {




  return `/api/game/loan/repay`
}

export const gameControllerRepayLoan = async (loanDto: LoanDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerRepayLoanUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(loanDto)
  }
);}




export const getGameControllerRepayLoanMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerRepayLoan>>, TError,{data: BodyType<LoanDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerRepayLoan>>, TError,{data: BodyType<LoanDto>}, TContext> => {

const mutationKey = ['gameControllerRepayLoan'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerRepayLoan>>, {data: BodyType<LoanDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerRepayLoan(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerRepayLoanMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerRepayLoan>>>
    export type GameControllerRepayLoanMutationBody = BodyType<LoanDto>
    export type GameControllerRepayLoanMutationError = ErrorType<unknown>

    export const useGameControllerRepayLoan = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerRepayLoan>>, TError,{data: BodyType<LoanDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerRepayLoan>>,
        TError,
        {data: BodyType<LoanDto>},
        TContext
      > => {
      return useMutation(getGameControllerRepayLoanMutationOptions(options), queryClient);
    }

export const getGameControllerSpendBossCoinsUrl = () => {




  return `/api/game/boss-coins/spend`
}

export const gameControllerSpendBossCoins = async (spendBossCoinsDto: SpendBossCoinsDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerSpendBossCoinsUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(spendBossCoinsDto)
  }
);}




export const getGameControllerSpendBossCoinsMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerSpendBossCoins>>, TError,{data: BodyType<SpendBossCoinsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerSpendBossCoins>>, TError,{data: BodyType<SpendBossCoinsDto>}, TContext> => {

const mutationKey = ['gameControllerSpendBossCoins'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerSpendBossCoins>>, {data: BodyType<SpendBossCoinsDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerSpendBossCoins(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerSpendBossCoinsMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerSpendBossCoins>>>
    export type GameControllerSpendBossCoinsMutationBody = BodyType<SpendBossCoinsDto>
    export type GameControllerSpendBossCoinsMutationError = ErrorType<unknown>

    export const useGameControllerSpendBossCoins = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerSpendBossCoins>>, TError,{data: BodyType<SpendBossCoinsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerSpendBossCoins>>,
        TError,
        {data: BodyType<SpendBossCoinsDto>},
        TContext
      > => {
      return useMutation(getGameControllerSpendBossCoinsMutationOptions(options), queryClient);
    }

export const getGameControllerAdRewardUrl = () => {




  return `/api/game/ad-reward`
}

export const gameControllerAdReward = async (adRewardDto: AdRewardDto, options?: RequestInit): Promise<ActionResponseDto> => {

  return customFetch<ActionResponseDto>(getGameControllerAdRewardUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adRewardDto)
  }
);}




export const getGameControllerAdRewardMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerAdReward>>, TError,{data: BodyType<AdRewardDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof gameControllerAdReward>>, TError,{data: BodyType<AdRewardDto>}, TContext> => {

const mutationKey = ['gameControllerAdReward'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof gameControllerAdReward>>, {data: BodyType<AdRewardDto>}> = (props) => {
          const {data} = props ?? {};

          return  gameControllerAdReward(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type GameControllerAdRewardMutationResult = NonNullable<Awaited<ReturnType<typeof gameControllerAdReward>>>
    export type GameControllerAdRewardMutationBody = BodyType<AdRewardDto>
    export type GameControllerAdRewardMutationError = ErrorType<unknown>

    export const useGameControllerAdReward = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof gameControllerAdReward>>, TError,{data: BodyType<AdRewardDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof gameControllerAdReward>>,
        TError,
        {data: BodyType<AdRewardDto>},
        TContext
      > => {
      return useMutation(getGameControllerAdRewardMutationOptions(options), queryClient);
    }

export const getLeaderboardControllerGetLeaderboardUrl = (type: string,
    params?: LeaderboardControllerGetLeaderboardParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/leaderboard/${type}?${stringifiedParams}` : `/api/leaderboard/${type}`
}

export const leaderboardControllerGetLeaderboard = async (type: string,
    params?: LeaderboardControllerGetLeaderboardParams, options?: RequestInit): Promise<LeaderboardResponseDto> => {

  return customFetch<LeaderboardResponseDto>(getLeaderboardControllerGetLeaderboardUrl(type,params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getLeaderboardControllerGetLeaderboardQueryKey = (type: string,
    params?: LeaderboardControllerGetLeaderboardParams,) => {
    return [
    `/api/leaderboard/${type}`, ...(params ? [params] : [])
    ] as const;
    }


export const getLeaderboardControllerGetLeaderboardQueryOptions = <TData = Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError = ErrorType<unknown>>(type: string,
    params?: LeaderboardControllerGetLeaderboardParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLeaderboardControllerGetLeaderboardQueryKey(type,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>> = ({ signal }) => leaderboardControllerGetLeaderboard(type,params, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: type !== null && type !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type LeaderboardControllerGetLeaderboardQueryResult = NonNullable<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>>
export type LeaderboardControllerGetLeaderboardQueryError = ErrorType<unknown>


export function useLeaderboardControllerGetLeaderboard<TData = Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError = ErrorType<unknown>>(
 type: string,
    params: undefined |  LeaderboardControllerGetLeaderboardParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>,
          TError,
          Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLeaderboardControllerGetLeaderboard<TData = Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError = ErrorType<unknown>>(
 type: string,
    params?: LeaderboardControllerGetLeaderboardParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>,
          TError,
          Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLeaderboardControllerGetLeaderboard<TData = Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError = ErrorType<unknown>>(
 type: string,
    params?: LeaderboardControllerGetLeaderboardParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useLeaderboardControllerGetLeaderboard<TData = Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError = ErrorType<unknown>>(
 type: string,
    params?: LeaderboardControllerGetLeaderboardParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof leaderboardControllerGetLeaderboard>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getLeaderboardControllerGetLeaderboardQueryOptions(type,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







