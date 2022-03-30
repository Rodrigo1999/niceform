import { Field } from '../types';
import { ReturnUseValuesFunction, UseValuesFunctionParams } from '../types/hooks';
export default function useValues({ fields, initialValues, hasChildrenInstance }: UseValuesFunctionParams<Field>): ReturnUseValuesFunction<Field>;
