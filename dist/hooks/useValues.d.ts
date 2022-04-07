import { Field } from '../types';
import { ReturnUseValuesFunction, UseValuesFunctionParams } from '../types/hooks';
export default function useValues({ fields, initialValues }: UseValuesFunctionParams<Field>): ReturnUseValuesFunction<Field>;
