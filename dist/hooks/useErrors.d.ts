import { Field } from '../types';
import { ReturnUseErrorsFunctionParams, useErrorsFunctionParams } from '../types/hooks';
export default function useErrors({ fields, errorsControl, yupSchema, values, hasChildrenInstance }: useErrorsFunctionParams<Field>): ReturnUseErrorsFunctionParams;
