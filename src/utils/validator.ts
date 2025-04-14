import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Response } from "express";
import { DataRequest } from "../base/base.request";
import { ErrorResp, Errors } from "./error";

export const PASSWORD_REGEX = RegExp("^((?=.*[0-9])(?=.*[a-zA-Z]).{6,})$");

export const transformAndValidate = <T extends object>(
  cls: ClassConstructor<T>
) => {
  return async (req: DataRequest<T>, res: Response, next: NextFunction) => {
    try {
      const data = {
        ...req.params,
        ...req.query,
        ...req.body,
      };

      // transform data to target instance
      req.data = plainToInstance(cls, data, {
        excludeExtraneousValues: true,
      });
      // validate instance
      await validateOrReject(req.data);
      next();
    } catch (err) {
      next(parseValidationError(err));
    }
  };
};

export async function transformAndValidateObjectAsync<T extends object>(
  cls: ClassConstructor<T>,
  data: object
) {
  try {
    // transform data to target instance
    const transformedObject = plainToInstance(cls, data, {
      excludeExtraneousValues: true,
    });
    // validate instance
    await validateOrReject(transformedObject);

    return transformedObject;
  } catch (err) {
    throw parseValidationError(err);
  }
}

const findFirstErrorMessage = (error: ValidationError): string | null => {
  if (error.constraints) {
    const constraintMessages = Object.values(error.constraints);
    if (constraintMessages.length > 0) {
      return constraintMessages[0];
    }
  }

  if (error.children) {
    for (const child of error.children) {
      const message = findFirstErrorMessage(child);
      if (message) {
        return message;
      }
    }
  }

  return null;
};

export const parseValidationError = (err: unknown) => {
  const validationErrs = err as ValidationError[];
  if (validationErrs.length == 0) {
    return err;
  }

  if (validationErrs[0]?.contexts != null) {
    const errValues = Object.values(validationErrs[0].contexts);

    if (errValues.length > 0) {
      const errResp = plainToInstance(ErrorResp, instanceToPlain(errValues[0]));

      if (errResp.message != null) {
        return errResp;
      }
    }
  } else if (validationErrs[0]?.children[0]?.children[0]?.["constraints"]) {
    const messErrs: string[] = Object.values(
      validationErrs[0]?.children[0]?.children[0]?.["constraints"]
    );

    if (messErrs.length) {
      return new ErrorResp(
        Errors.BadRequest.code,
        messErrs[0],
        Errors.BadRequest.status
      );
    }
  }

  // if (validationErrs[0]?.constraints != null) {
  //     const constraintValues = Object.values(validationErrs[0].constraints)

  //     if (constraintValues.length > 0) {
  //         return new ErrorResp(
  //             Errors.BadRequest.code,
  //             constraintValues[0],
  //             Errors.BadRequest.status
  //         )
  //     }
  // } else if (validationErrs[0]?.children[0]?.constraints != null) {
  //     const constraintValues = Object.values(
  //         validationErrs[0].children[0].constraints
  //     )

  //     if (constraintValues.length > 0) {
  //         return new ErrorResp(
  //             Errors.BadRequest.code,
  //             constraintValues[0],
  //             Errors.BadRequest.status
  //         )
  //     }
  // }
  const errorMessage = findFirstErrorMessage(validationErrs[0]);

  if (errorMessage) {
    return new ErrorResp(
      Errors.BadRequest.code,
      errorMessage,
      Errors.BadRequest.status
    );
  }
  return Errors.BadRequest;
};
