import AuthForm from "@/components/auth/AuthForm";

export default function SignInPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
            <AuthForm mode="signup" />
        </main>
    );
}
