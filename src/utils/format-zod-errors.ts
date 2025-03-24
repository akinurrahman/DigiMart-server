import { ZodError } from "zod";

export const formatZodErrors = (zodError: ZodError): string => {
  const errors = Object.values(zodError.format())
    .flatMap((error: any) => (error?._errors ? error._errors : []))
    .filter(Boolean);

  return errors.join(", ");
};
