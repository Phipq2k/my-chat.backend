import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import mongoose from "mongoose";

export function IsObjectId(validationOptions?: ValidationOptions){
    return (object: any, propertyName: string) =>{
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: ObjectIdConstraint,
        });
    }
}


//Check Type ObjectId
@ValidatorConstraint({name: 'IsObjectId'})
class ObjectIdConstraint implements ValidatorConstraintInterface{
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(value);
        return isValidObjectId;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Id không hợp lệ';
    }
}