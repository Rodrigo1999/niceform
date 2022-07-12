import type { Field } from '../types';
import type { ReturnUseValuesFunction, UseValuesFunctionParams } from '../types/hooks';
export default function useValues({ fields, initialValues }: UseValuesFunctionParams<Field>): ReturnUseValuesFunction<Field>;
