'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/src/shared/lib/utils';
import { Input } from '../ui';
import { RequiredSymbol } from '../required-symbol';
import { ClearButton, ErrorText, ShowPasswordIcon } from '@/src/shared/components';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FormInput: React.FC<Props> = ({
  className,
  name,
  label,
  required,
  children,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickCleare = () => {
    setValue(name, name === 'phone' ? '+7' : '', { shouldValidate: true });
  };
  return (
    <div className={cn(className, 'relative')}>
      {label && (
        <p className='mb-1 text-sm font-medium'>
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className='relative'>
        {children}

        <Input
          {...props}
          type={props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type}
          {...register(name)}
          className={children?.valueOf && 'pl-9'}
        />
        {value &&
          (props.type !== 'password' ? (
            <ClearButton onClick={onClickCleare} />
          ) : (
            <ShowPasswordIcon showPassword={showPassword} setShowPassword={setShowPassword} />
          ))}
      </div>

      {errorText && <ErrorText className='' text={errorText} />}
    </div>
  );
};
