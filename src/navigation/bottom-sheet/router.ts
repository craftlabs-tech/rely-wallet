import type {
  CommonNavigationAction,
  Router,
  StackActionType,
  StackNavigationState,
  StackRouterOptions,
} from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

import { StackRouter } from '@react-navigation/native';

import { actions } from './actions';

export const router = (
  routerOptions: StackRouterOptions,
): Router<StackNavigationState<RootStackParamList>, CommonNavigationAction | StackActionType> => {
  const stackRouter = StackRouter(routerOptions);

  return {
    ...stackRouter,

    actionCreators: {
      ...stackRouter.actionCreators,
      ...actions,
    },

    // @ts-expect-error doesn't like the typing of RootStackParamList
    getStateForAction(state, action, options) {
      switch (action.type) {
        // TODO
        default:
          return stackRouter.getStateForAction(state, action, options);
      }
    },
  };
};
