"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Bug,
  HelpCircle,
  Info,
  Lightbulb,
  LogIn,
  MessageSquare,
  Send,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FieldDescription as FDescription,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth.store";
import {
  useSubmitFeedback,
  useFeedbacks,
  useUserFeedbacks,
  useUnreadFeedbackCount,
} from "@/hooks/queries/feedback";
import { FeedbackCategory, FeedbackStatus } from "@/types/feedback";
import { useRouter } from "next/navigation";
import { FeedbackList } from "@/components/feedback/feedback-list";

const categories = [
  { value: "feature", label: "Đề xuất tính năng mới", icon: Lightbulb },
  { value: "improvement", label: "Cải thiện tính năng", icon: MessageSquare },
  { value: "bug", label: "Báo lỗi", icon: Bug },
  { value: "suggestion", label: "Đề xuất truyện mới", icon: Lightbulb },
  { value: "other", label: "Khác", icon: HelpCircle },
] as const;

// ✅ Zod Schema for Feedback Form
const feedbackSchema = z.object({
  category: z.nativeEnum(FeedbackCategory, {
    required_error: "Vui lòng chọn loại feedback",
  }),
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề không được quá 100 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(1000, "Mô tả không được quá 1000 ký tự"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();
  const {
    data: allFeedbacksData,
    isLoading: isLoadingAllFeedbacks,
    hasNextPage: hasNextPageAll,
    isFetchingNextPage: isFetchingNextPageAll,
    fetchNextPage: fetchNextPageAll,
  } = useFeedbacks(!!user);
  const {
    data: userFeedbacksData,
    isLoading: isLoadingUserFeedbacks,
    hasNextPage: hasNextPageUser,
    isFetchingNextPage: isFetchingNextPageUser,
    fetchNextPage: fetchNextPageUser,
  } = useUserFeedbacks(user?.id);
  const { data: unreadCount = 0 } = useUnreadFeedbackCount(user?.id);

  // Flatten infinite query data
  const allFeedbacks =
    allFeedbacksData?.pages.flatMap((page) => page.data) || [];
  const userFeedbacks =
    userFeedbacksData?.pages.flatMap((page) => page.data) || [];

  // ✅ React Hook Form Setup
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: FeedbackCategory.Improvement,
      title: "",
      description: "",
    },
  });

  // Watch values for char count
  const titleValue = watch("title");
  const descriptionValue = watch("description");

  const onSubmit = (data: FeedbackFormData) => {
    submitFeedback(
      {
        category: data.category as FeedbackCategory,
        title: data.title,
        description: data.description,
        user_id: user?.id,
        status: FeedbackStatus.Pending,
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const notLogin = (
    <div>
      <Alert className="mb-6" variant="warning">
        <AlertDescription className="flex flex-rol gap-4">
          <Info className="h-4 w-4" />
          <span className="text-sm">
            Để web hoạt động ổn định, chống spam. Bạn vui lòng đăng nhập để gửi
            feedback.
          </span>
        </AlertDescription>
      </Alert>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/login?redirect=/feedback")}
        className="shrink-0"
      >
        <LogIn className="mr-2 h-4 w-4" />
        Đăng nhập
      </Button>
    </div>
  );

  const feedBackForm = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        {/* Category Selection - Controlled Component */}
        <Field>
          <FieldLabel className="required-indicator">Loại feedback</FieldLabel>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại feedback" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <FieldError>{errors.category.message}</FieldError>
          )}
        </Field>

        {/* Title */}
        <Field>
          <FieldLabel className="required-indicator" htmlFor="title">
            Tiêu đề
          </FieldLabel>
          <Input
            maxLength={100}
            id="title"
            placeholder="Tóm tắt ngắn gọn về feedback của bạn"
            {...register("title")}
          />
          <div className="flex justify-between items-start">
            {errors.title ? (
              <FieldError>{errors.title.message}</FieldError>
            ) : (
              <span />
            )}
            <FDescription
              className={titleValue.length > 100 ? "text-destructive" : ""}
            >
              {titleValue.length || 0}/100 ký tự
            </FDescription>
          </div>
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel className="required-indicator" htmlFor="description">
            Mô tả chi tiết
          </FieldLabel>
          <Textarea
            maxLength={1000}
            id="description"
            placeholder="Mô tả chi tiết về feedback của bạn..."
            rows={6}
            {...register("description")}
          />
          <div className="flex justify-between items-start">
            {errors.description ? (
              <FieldError>{errors.description.message}</FieldError>
            ) : (
              <span />
            )}
            <FDescription
              className={
                descriptionValue.length > 1000 ? "text-destructive" : ""
              }
            >
              {descriptionValue.length || 0}/1000 ký tự
            </FDescription>
          </div>
        </Field>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isPending}
        >
          {isSubmitting || isPending ? "Đang gửi..." : "Gửi Feedback"}
        </Button>
      </FieldGroup>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Feedback</CardTitle>
          <CardDescription>
            Chúng tôi rất mong nhận được ý kiến đóng góp từ bạn để cải thiện ứng
            dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Tất cả Feedback
                </TabsTrigger>
                <TabsTrigger value="send" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Gửi Feedback
                </TabsTrigger>
                <TabsTrigger
                  value="mine"
                  className="flex items-center gap-2 relative"
                >
                  <List className="h-4 w-4" />
                  Feedback của tôi
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold rounded-full min-w-[20px]"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <FeedbackList
                  feedbacks={allFeedbacks}
                  isLoading={isLoadingAllFeedbacks}
                  hasNextPage={hasNextPageAll}
                  isFetchingNextPage={isFetchingNextPageAll}
                  onLoadMore={() => fetchNextPageAll()}
                />
              </TabsContent>
              <TabsContent value="send" className="mt-6">
                {feedBackForm}
              </TabsContent>
              <TabsContent value="mine" className="mt-6">
                <FeedbackList
                  feedbacks={userFeedbacks}
                  isLoading={isLoadingUserFeedbacks}
                  hasNextPage={hasNextPageUser}
                  isFetchingNextPage={isFetchingNextPageUser}
                  onLoadMore={() => fetchNextPageUser()}
                />
              </TabsContent>
            </Tabs>
          ) : (
            notLogin
          )}
        </CardContent>
      </Card>
    </div>
  );
}
