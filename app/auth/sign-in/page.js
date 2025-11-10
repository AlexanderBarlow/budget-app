import AuthForm from "@/components/auth/AuthForm";

export default function SignInPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#edf3f1] via-[#e9eeec] to-[#e3e9e8] p-6">
            <AuthForm mode="signin" />
        </main>
    );
}
