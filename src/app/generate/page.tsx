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
import { BorderBeam } from "@/components/ui/border-beam";
import { BeatLoader } from "react-spinners";

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
  types: z.array(z.string()).min(1).max(8),
  result: z.string().optional(),
  rating: z.string().optional(),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
      types: [],
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
      const { prompt_input, categories, types } = values;

      const payload = {
        body: prompt_input,
        categories: categories,
        types: types,
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
        description: "Project idea generated successfully.",
      });
      setLoading(false);
      setIsGenerating(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to generate project idea.",
      });
    }
  }

  const { pending } = useFormStatus();

  return (
    // <WarpBackground>
    <div className="main flex items-center justify-center h-screen p-10">
      <div className="relative main-container bg-white shadow-xl px-20 py-10 rounded-lg">
        <div className="heading flex flex-col items-center justify-center space-y-4">
          {/* <h1 className="text-4xl font-bold text-center">Generate Title Ideas</h1> */}
          <HyperText className=" text-3xl sm:text-4xl md:text-3xl lg:text-4xl text-center">
            Generate Capstone Project Ideas
          </HyperText>

          <TextAnimate
            className="hidden md:block lg:block"
            animation="blurInUp"
            by="word"
          >
            {
              "Unleash your creativity and find the perfect project idea with our  AI-powered tool! Designed specifically for computer science students, this app helps you generate unique, innovative, and tailored project ideas."
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
                      placeholder="e.g I want something thats helps the school."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid  md:grid-cols-12 lg:grid-cols-12 gap-4">
              <div className="col-span-6">
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
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="types"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Project Type</FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          loop
                          className="max- cursor-pointer"
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Select project type" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {[
                                "Web Application",
                                "Mobile",
                                "Desktop",
                                "IOT (Internet of Things)",
                                "AI (Artificial Intelligence)",
                                "Machine Learning Application",
                                "Game Development",
                                "Hardware",
                              ]
                                .filter(
                                  (types): types is string =>
                                    types !== undefined
                                )
                                .map((types) => (
                                  <MultiSelectorItem key={types} value={types}>
                                    {types}
                                  </MultiSelectorItem>
                                ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      {/* <FormDescription>Select multiple categories.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={` ${isResultVisible ? "" : `hidden`} `}>
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

            {/* <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className=" flex-col items-start hidden">
                  <FormLabel>Rating</FormLabel>
                  <FormControl className="w-full">
                    <Rating {...field} value={Number(field.value)} />
                  </FormControl>
                  <FormDescription>Please provide your rating.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="submit-btn w-full flex justify-center">
              <Button className="w-80 h-10" type="submit" disabled={pending}>
                {loading ? (
                  <BeatLoader color="#ffffff" size={12} />
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <BorderBeam />
      </div>
    </div>
    // </WarpBackground>
  );
}
