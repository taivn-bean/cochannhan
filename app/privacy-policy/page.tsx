import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật | Cổ Chân Nhân",
  description: "Chính sách bảo mật và quyền riêng tư của Cổ Chân Nhân - nền tảng đọc truyện online",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-blue-500" />
              Chính Sách Bảo Mật
            </h1>
            <p className="text-muted-foreground">
              Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Giới Thiệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chào mừng bạn đến với Cổ Chân Nhân. Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân của bạn. 
                  Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi bạn sử dụng dịch vụ của chúng tôi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Thông Tin Chúng Tôi Thu Thập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">2.1. Thông tin cá nhân</h3>
                  <p className="text-muted-foreground">
                    Khi bạn đăng ký tài khoản, chúng tôi có thể thu thập:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>Email</li>
                    <li>Tên người dùng</li>
                    <li>Ảnh đại diện (nếu bạn cung cấp)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2.2. Dữ liệu sử dụng</h3>
                  <p className="text-muted-foreground">
                    Chúng tôi tự động thu thập thông tin về cách bạn sử dụng dịch vụ của chúng tôi:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>Lịch sử đọc truyện</li>
                    <li>Dấu trang và tiến độ đọc</li>
                    <li>Cài đặt đọc truyện (phông chữ, kích thước, màu nền)</li>
                    <li>Thông tin thiết bị và trình duyệt</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Cách Chúng Tôi Sử Dụng Thông Tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi sử dụng thông tin của bạn để:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Cung cấp và duy trì dịch vụ đọc truyện</li>
                  <li>Lưu trữ tiến độ đọc và dấu trang của bạn</li>
                  <li>Cải thiện trải nghiệm người dùng</li>
                  <li>Gửi thông báo về cập nhật và tính năng mới</li>
                  <li>Phân tích cách sử dụng để cải thiện dịch vụ</li>
                  <li>Bảo vệ an ninh và phòng chống gian lận</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Lưu Trữ Dữ Liệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Dữ liệu của bạn được lưu trữ an toàn trên các máy chủ đám mây. Chúng tôi sử dụng:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li><strong>Local Storage</strong>: Lưu trữ cài đặt đọc truyện trên thiết bị của bạn</li>
                  <li><strong>Supabase</strong>: Lưu trữ thông tin tài khoản và dữ liệu đồng bộ</li>
                  <li><strong>Cookies</strong>: Lưu trữ phiên đăng nhập và tùy chọn người dùng</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Chia Sẻ Thông Tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. 
                  Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Khi có yêu cầu hợp pháp từ cơ quan chức năng</li>
                  <li>Để bảo vệ quyền lợi, tài sản và an toàn của chúng tôi và người dùng</li>
                  <li>Với các nhà cung cấp dịch vụ hỗ trợ vận hành website (Google Analytics, hosting)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies và Công Nghệ Theo Dõi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi sử dụng cookies và công nghệ tương tự để:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Duy trì phiên đăng nhập của bạn</li>
                  <li>Ghi nhớ cài đặt và tùy chọn của bạn</li>
                  <li>Phân tích lưu lượng truy cập (Google Analytics)</li>
                  <li>Cải thiện hiệu suất website</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Bạn có thể cấu hình trình duyệt để từ chối cookies, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng dịch vụ.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Quyền Của Bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li><strong>Truy cập</strong>: Xem thông tin cá nhân chúng tôi lưu trữ về bạn</li>
                  <li><strong>Chỉnh sửa</strong>: Cập nhật hoặc sửa thông tin cá nhân của bạn</li>
                  <li><strong>Xóa</strong>: Yêu cầu xóa tài khoản và dữ liệu của bạn</li>
                  <li><strong>Từ chối</strong>: Từ chối việc xử lý dữ liệu của bạn</li>
                  <li><strong>Xuất dữ liệu</strong>: Yêu cầu sao lưu dữ liệu của bạn</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Bảo Mật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin của bạn khỏi truy cập, 
                  thay đổi, tiết lộ hoặc phá hủy trái phép:
                </p>
                <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
                  <li>Mã hóa dữ liệu trong quá trình truyền tải (HTTPS)</li>
                  <li>Mã hóa mật khẩu</li>
                  <li>Xác thực an toàn qua Supabase</li>
                  <li>Giới hạn quyền truy cập vào dữ liệu</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Trẻ Em</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Dịch vụ của chúng tôi không nhắm đến trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin 
                  cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn là phụ huynh hoặc người giám hộ và phát hiện con bạn đã 
                  cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ để chúng tôi xóa thông tin đó.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Thay Đổi Chính Sách</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn 
                  về bất kỳ thay đổi nào bằng cách đăng Chính sách bảo mật mới trên trang này và cập nhật "Cập nhật lần cuối".
                </p>
                <p className="text-muted-foreground">
                  Bạn nên xem lại Chính sách bảo mật này định kỳ để biết về bất kỳ thay đổi nào. 
                  Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận các thay đổi đó.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Liên Hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua:
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
