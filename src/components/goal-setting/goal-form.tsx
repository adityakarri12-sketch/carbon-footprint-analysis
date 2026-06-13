"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";

const goalFormSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  targetDate: z.date({
    message: "A target date is required.",
  }),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  onGoalAdded: () => void;
}

export function GoalForm({ onGoalAdded }: GoalFormProps) {
  const { toast } = useToast();
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(data: GoalFormValues) {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add goal');
      }

      toast({
        title: "Goal Added!",
        description: "Your new goal has been saved.",
      });
      form.reset({ description: "", targetDate: undefined });
      onGoalAdded();
    } catch (_error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Reduce car travel by 20%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Target Date</FormLabel>
              <DatePicker date={field.value} setDate={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Goal</Button>
      </form>
    </Form>
  );
}
