import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  preferOneGenericInCreateForFeatureSelector,
  preferOneGenericInCreateForFeatureSelectorSuggest,
} from '../../../src/rules/store/prefer-one-generic-in-create-for-feature-selector';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `const createFeatureSelector = test('feature-state')`,
  `const featureOk = createFeatureSelector('feature-state')`,
  `const featureOk1 = createFeatureSelector<FeatureState>('feature-state')`,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
const featureNotOk = createFeatureSelector<GlobalState, FeatureState>('feature-state')
                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector} suggest]`,
    {
      suggestions: [
        {
          messageId: preferOneGenericInCreateForFeatureSelectorSuggest,
          output: `
const featureNotOk = createFeatureSelector< FeatureState>('feature-state')`,
        },
      ],
    }
  ),
  fromFixture(
    `
const featureNotOk1 = createFeatureSelector<AppState, readonly string[]>('feature-state')
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector} suggest]`,
    {
      suggestions: [
        {
          messageId: preferOneGenericInCreateForFeatureSelectorSuggest,
          output: `
const featureNotOk1 = createFeatureSelector< readonly string[]>('feature-state')`,
        },
      ],
    }
  ),
  fromFixture(
    `
const featureNotOk2 = createFeatureSelector<GlobalState  , StateA & StateB>('feature-state')
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${preferOneGenericInCreateForFeatureSelector} suggest]`,
    {
      suggestions: [
        {
          messageId: preferOneGenericInCreateForFeatureSelectorSuggest,
          output: `
const featureNotOk2 = createFeatureSelector< StateA & StateB>('feature-state')`,
        },
      ],
    }
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
