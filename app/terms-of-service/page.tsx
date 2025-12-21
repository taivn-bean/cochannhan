import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng | Cổ Chân Nhân",
  description: "Điều khoản và điều kiện sử dụng dịch vụ của Cổ Chân Nhân - nền tảng đọc truyện online",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-blue-500" />
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-muted-foreground">
              Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Chấp Nhận Điều Khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chào mừng bạn đến với Cổ Chân Nhân. Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, 
                  bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sau đây. 
                  Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Mô Tả Dịch Vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Cổ Chân Nhân là một nền tảng đọc truyện online cung cấp:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Đọc truyện miễn phí với giao diện thân thiện</li>
                  <li>Lưu tiến độ đọc và dấu trang</li>
                  <li>Tùy chỉnh cài đặt đọc (phông chữ, kích thước, màu nền)</li>
                  <li>Đồng bộ dữ liệu giữa các thiết bị (khi đăng nhập)</li>
                  <li>Góp ý và báo lỗi</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Đăng Ký Tài Khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">3.1. Tài khoản người dùng</h3>
                  <p className="text-muted-foreground">
                    Để sử dụng một số tính năng của dịch vụ, bạn có thể cần tạo tài khoản. Khi tạo tài khoản, bạn phải:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                    <li>Duy trì bảo mật mật khẩu và tài khoản của bạn</li>
                    <li>Chịu trách nhiệm về tất cả hoạt động diễn ra dưới tài khoản của bạn</li>
                    <li>Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ vi phạm bảo mật nào</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2. Độ tuổi</h3>
                  <p className="text-muted-foreground">
                    Bạn phải từ 13 tuổi trở lên để sử dụng dịch vụ này. Nếu bạn dưới 18 tuổi, 
                    bạn phải được sự cho phép của phụ huynh hoặc người giám hộ hợp pháp.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Quyền Sử Dụng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi cấp cho bạn quyền sử dụng có giới hạn, không độc quyền, không thể chuyển nhượng để:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Truy cập và sử dụng dịch vụ cho mục đích cá nhân, phi thương mại</li>
                  <li>Đọc nội dung được cung cấp trên nền tảng</li>
                  <li>Sử dụng các tính năng được cung cấp</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Hành Vi Bị Cấm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Khi sử dụng dịch vụ, bạn KHÔNG được:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Vi phạm bất kỳ luật hoặc quy định hiện hành nào</li>
                  <li>Sao chép, sửa đổi, phân phối hoặc bán nội dung từ dịch vụ</li>
                  <li>Sử dụng bot, script hoặc công cụ tự động để truy cập dịch vụ</li>
                  <li>Cố gắng xâm nhập, làm hỏng hoặc làm gián đoạn dịch vụ</li>
                  <li>Thu thập thông tin người dùng khác</li>
                  <li>Tải lên nội dung độc hại, spam hoặc không phù hợp</li>
                  <li>Mạo danh bất kỳ cá nhân hoặc tổ chức nào</li>
                  <li>Sử dụng dịch vụ cho mục đích thương mại mà không được phép</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Nội Dung và Quyền Sở Hữu Trí Tuệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">6.1. Quyền sở hữu</h3>
                  <p className="text-muted-foreground">
                    Tất cả nội dung trên dịch vụ, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, 
                    biểu tượng, mã nguồn và thiết kế, thuộc sở hữu của chúng tôi hoặc người cấp phép của chúng tôi 
                    và được bảo vệ bởi luật bản quyền và sở hữu trí tuệ.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">6.2. Vi phạm bản quyền</h3>
                  <p className="text-muted-foreground">
                    Chúng tôi tôn trọng quyền sở hữu trí tuệ của người khác. Nếu bạn tin rằng nội dung trên 
                    dịch vụ vi phạm bản quyền của bạn, vui lòng liên hệ với chúng tôi qua trang Góp ý - Báo lỗi.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Nội Dung Người Dùng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nếu bạn gửi bất kỳ nội dung nào (bình luận, góp ý, báo lỗi), bạn:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Giữ quyền sở hữu nội dung của bạn</li>
                  <li>Cấp cho chúng tôi quyền sử dụng, hiển thị và xử lý nội dung đó</li>
                  <li>Đảm bảo bạn có quyền chia sẻ nội dung đó</li>
                  <li>Chịu trách nhiệm về nội dung bạn đăng tải</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Chúng tôi có quyền xóa bất kỳ nội dung nào vi phạm điều khoản này hoặc chúng tôi cho là không phù hợp.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Từ Chối Bảo Hành</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Dịch vụ được cung cấp "NGUYÊN TRẠNG" và "NHỦ CÓ SẴN" mà không có bất kỳ bảo hành nào, 
                  dù rõ ràng hay ngụ ý. Chúng tôi không bảo đảm rằng:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Dịch vụ sẽ không bị gián đoạn hoặc không có lỗi</li>
                  <li>Nội dung sẽ luôn chính xác và đầy đủ</li>
                  <li>Dịch vụ sẽ đáp ứng yêu cầu cụ thể của bạn</li>
                  <li>Các lỗi sẽ được sửa chữa kịp thời</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Giới Hạn Trách Nhiệm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Trong phạm vi tối đa được pháp luật cho phép, chúng tôi sẽ không chịu trách nhiệm về:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc hệ quả</li>
                  <li>Mất dữ liệu, lợi nhuận hoặc doanh thu</li>
                  <li>Gián đoạn kinh doanh</li>
                  <li>Mất uy tín hoặc danh tiếng</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Chấm Dứt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi có quyền chấm dứt hoặc tạm ngừng quyền truy cập của bạn vào dịch vụ ngay lập tức, 
                  không cần thông báo trước hoặc chịu trách nhiệm, vì bất kỳ lý do gì, bao gồm nhưng không giới hạn 
                  nếu bạn vi phạm Điều khoản sử dụng.
                </p>
                <p className="text-muted-foreground">
                  Bạn có thể ngừng sử dụng dịch vụ và xóa tài khoản của mình bất cứ lúc nào.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Thay Đổi Điều Khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi có quyền sửa đổi hoặc thay thế các Điều khoản này bất cứ lúc nào. 
                  Nếu có thay đổi quan trọng, chúng tôi sẽ cố gắng thông báo trước ít nhất 30 ngày 
                  trước khi các điều khoản mới có hiệu lực.
                </p>
                <p className="text-muted-foreground">
                  Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận các điều khoản mới.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Luật Điều Chỉnh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Các Điều khoản này sẽ được điều chỉnh và hiểu theo luật pháp Việt Nam, 
                  không tính đến các quy định về xung đột pháp luật của nó.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Tính Độc Lập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nếu bất kỳ điều khoản nào của Điều khoản này bị coi là không thể thi hành hoặc không hợp lệ, 
                  điều khoản đó sẽ được thay đổi và giải thích để đạt được mục tiêu của điều khoản đó trong phạm vi 
                  tối đa có thể theo luật hiện hành, và các điều khoản còn lại sẽ tiếp tục có hiệu lực đầy đủ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>14. Liên Hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nếu bạn có bất kỳ câu hỏi nào về Điều khoản sử dụng này, vui lòng liên hệ với chúng tôi qua:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Trang Góp ý - Báo lỗi trên website</li>
                  <li>Email: nguyenvantai22298@gmail.com</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
