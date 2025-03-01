import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  return <div>Login Page</div>;
}

export default LoginPage;

async function safeFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        return data || {};  // Ensure it's never undefined
    } catch (error) {
        console.error("API Fetch Error:", error);
        return { error: error.message };
    }
}
