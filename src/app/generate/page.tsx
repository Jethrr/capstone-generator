"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useFormStatus } from "react-dom";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Rating } from "@/components/ui/rating";
import HyperText from "@/components/ui/hyper-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { WarpBackground } from "@/components/ui/warp-background";

import { useToast } from "@/hooks/use-toast";

// import { WarpBackground } from "@/components/ui/warp-background";
const formSchema = z.object({
  prompt_input: z.string(),
  categories: z.array(z.string()).min(1).max(8),
  result: z.string().optional(),
  rating: z.string().optional(),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
    },
  });

  const [isResultVisible, setIsResultVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  //   const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setIsGenerating(true);

    try {
      console.log(values);
      const { prompt_input, categories } = values;

      const payload = {
        body: prompt_input,
        categories: categories,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/generate`,
        payload
      );

      if (response.status !== 200) {
        throw new Error("API call failed");
      }

      const data = response.data;
      console.log("Generated Output:", data.output);
      form.setValue("result", data.output);
      setIsResultVisible(true);
      toast({
        title: "Success!",
        description: "Project title generated successfully.",
      });
      setLoading(false);
      setIsGenerating(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to generate project title.",
      });
    }
  }

  const { pending } = useFormStatus();

  return (
    <WarpBackground>
      <div className="main flex items-center justify-center h-screen">
        <div className="main-container bg-white shadow-sm px-20 py-3">
          <div className="heading flex flex-col items-center justify-center space-y-4">
            {/* <h1 className="text-4xl font-bold text-center">Generate Title Ideas</h1> */}
            <HyperText className="text-center">
              Generate Capstone Title Ideas
            </HyperText>
            {/* <p className="text-center text-md mt-4 justify-center max-w-3xl">
            Unleash your creativity and find the perfect project idea with our{" "}
            AI-powered tool! Designed specifically for computer science
            students, this app helps you generate unique, innovative, and
            tailored project titles.{" "}
          </p> */}
            <TextAnimate animation="blurInUp" by="word">
              {
                "Unleash your creativity and find the perfect project idea with our  AI-powered tool! Designed specifically for computer science students, this app helps you generate unique, innovative, and tailored project titles."
              }
            </TextAnimate>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-3xl mx-auto py-10 "
            >
              <FormField
                control={form.control}
                name="prompt_input"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter topics or specific keywords</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g I want something thats helps the school"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                        className="max-w"
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Select categories" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {[
                              "Healthcare",
                              "Education",
                              "Economic",
                              "Environment",
                              "Technology",
                              "Social Good",
                              "Entertainment",
                              "Sports",
                              "Artificial Intelligence",
                              "Machine Learning",
                              "Blockchain",
                              "Cybersecurity",
                              "Augmented Reality (AR)",
                              "Virtual Reality (VR)",
                              "Internet of Things (IoT)",
                              "Cloud Computing",
                              "Data Science",
                              "Big Data",
                              "Gaming",
                              "Sustainability",
                              "E-commerce",
                              "Finance",
                              "Automation",
                              "Robotics",
                              "Transportation",
                              "Smart Cities",
                              "Energy",
                              "Agriculture",
                              "Media",
                              "Space Exploration",
                              "Accessibility",
                              "Legal Tech",
                              "Travel",
                              "Food and Nutrition",
                              "Music and Arts",
                              "Mental Health",
                              "Disaster Management",
                              "Communication",
                              "Startups",
                              "Personal Productivity",
                              "Fashion",
                              "Design",
                              "Computer Vision",
                            ].map((category) => (
                              <MultiSelectorItem
                                key={category}
                                value={category}
                              >
                                {category}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    <FormDescription>
                      Select multiple categories.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* {output && (
            <ScriptCopyBtn
              showMultiplePackageOptions={false}
              codeLanguage="shell"
              lightTheme="nord"
              darkTheme="vitesse-dark"
              commandMap={{ default: output }}
            />
          )} */}

              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={` ${isResultVisible ? "" : `hidden`} `}
                    >
                      Output
                    </FormLabel>
                    <FormControl>
                      {isGenerating ? ( // Check if the result is being generated
                        <Skeleton className="h-72 w-full resize-y" /> // Display the skeleton loader
                      ) : (
                        <Textarea
                          placeholder=""
                          className={`h-72 resize-y ${
                            isResultVisible ? "" : `hidden`
                          } `}
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className=" flex-col items-start hidden">
                    <FormLabel>Rating</FormLabel>
                    <FormControl className="w-full">
                      <Rating {...field} value={Number(field.value)} />
                    </FormControl>
                    <FormDescription>
                      Please provide your rating.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={pending}>
                {loading ? "Generating..." : "Generate"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </WarpBackground>
  );
}
