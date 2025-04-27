import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import {cn} from "@/app/lib/utils";
import * as React from "react";

interface FormTextareaProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
	error?: string;
	registration: UseFormRegisterReturn;
}

export function FormTextarea({
	id,
	label,
	error,
	registration,
	className,
	...rest
	}: FormTextareaProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="text-black font-semibold">
				{label}
			</label>
			<textarea
				id={id}
				className={cn(
					"flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				{...registration}
				{...rest}
			/>
			{error && (
				<p className="text-red-500 text-sm mt-1">{error}</p>
			)}
		</div>
	);
}
