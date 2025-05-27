import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
    RequestCookies,
    ResponseCookies,
  } from "next/dist/compiled/@edge-runtime/cookies";

export async function middleware(request: NextRequest) {
	// 요청 헤더에서 로그인 여부를 확인할 수 있도록 쿠키
    const { nextUrl, cookies } = request;
    const { origin, pathname } = nextUrl;
    const accessToken:any = cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN);
    console.log('accessToken',process.env.NEXT_PUBLIC_AUTH_TOKEN,accessToken?.value)
    console.log('pathname  top ',pathname);
    // 값이 
    let res = NextResponse.rewrite(request.url);
    if (accessToken !== undefined) {
        const isToken:any = await cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN).value;
        console.log("1111", isToken );
        console.log("1111_11111",JSON.parse(isToken)?.is_state)
        if ( JSON.parse(isToken)?.is_state || JSON.parse(isToken)?.is_state == 'true' ) {
            console.log("2222",JSON.parse(isToken)?.is_state);
            if (pathname.startsWith('/auth') || pathname.startsWith('/admin/auth')) {
                console.log("33333");
                res =  NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_ASSETS_PREFIX}/v1/dashboard`, request.url));
                res.cookies.set(process.env.NEXT_PUBLIC_AUTH_TOKEN,cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN)?.value);
                applySetCookie(request, res);
                return res;
            }
            return  NextResponse.next();

        }else{
            console.log("4444");
            if (pathname.startsWith('/auth') || pathname.startsWith('/admin/auth')) {
                console.log("4444 if" );
                return NextResponse.next();
            }else{
                console.log("4444 else");
                res.cookies.delete(process.env.NEXT_PUBLIC_AUTH_TOKEN)
                res = NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_ASSETS_PREFIX}/auth/sign-in`, request.url));
                applySetCookie(request, res);
                return res;
            }
        }

    } else {
            console.log("55555");
        if ( pathname === '/auth/sign-in' || pathname === '/admin/auth/sign-in') {
                console.log("6666");
            return NextResponse.next();
        }
        res.cookies.delete(process.env.NEXT_PUBLIC_AUTH_TOKEN)
        res = NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_ASSETS_PREFIX}/auth/sign-in`, request.url));
        applySetCookie(request, res);
        return res;
    }
  /*   if (accessToken !== undefined) {
        if ( pathname  === "/auth/sign-in") {
            return NextResponse.redirect(new URL(`/v1/dashboard`,request.url)
            )
        }else{
            return NextResponse.next();
        }
        
    }else{
       
        if ( pathname  === "/auth/sign-in") {
            return NextResponse.next();
            
        }else{
            console.log('pathname else',pathname)
            // 로그인이 필요 없는 페이지는 그냥 다음 요청으로 진행
            return NextResponse.rewrite(new URL(`/auth/sign-in`, request.url));
        }
    } */
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
  

  function applySetCookie(req: NextRequest, res: NextResponse): void {
    const resCookies = new ResponseCookies(res.headers);
    const newReqHeaders = new Headers(req.headers);
    const newReqCookies = new RequestCookies(newReqHeaders);
  
    resCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  
    NextResponse.next({
      request: { headers: newReqHeaders },
    }).headers.forEach((value, key) => {
      if (
        key === "x-middleware-override-headers" ||
        key.startsWith("x-middleware-request-")
      ) {
        res.headers.set(key, value);
      }
    });
  }