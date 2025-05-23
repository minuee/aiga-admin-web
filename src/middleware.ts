import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	// 요청 헤더에서 로그인 여부를 확인할 수 있도록 쿠키
    const { nextUrl, cookies } = request;
    const { origin, pathname } = nextUrl;
    const accessToken = cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN);
    console.log('accessToken',process.env.NEXT_PUBLIC_AUTH_TOKEN,accessToken)
    if (accessToken !== undefined) {
        if ( pathname === "/auth/sign-in") {
            return NextResponse.redirect(new URL(`/admin/default`,request.url)
            )
        }else{
            return NextResponse.next();
        }
        
    }else{
        console.log('pathname',pathname)
        if ( pathname === "/auth/sign-in") {
            return NextResponse.next();
            
        }else{
            console.log('pathname else',pathname)
            // 로그인이 필요 없는 페이지는 그냥 다음 요청으로 진행
            return NextResponse.rewrite(new URL("/auth/sign-in", request.url));
        }
    }
}


/* export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|fonts|images|manifest.json|.*\\.png$).*)',
    ],
  }; */
  

  export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|fonts|images|manifest.json|manifest.webmanifest|.*\\.png$).*)',
    ],
  };
  