"use client"
// components/login-form.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { saveApiKey } from "@/app/actions/apikey";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    function SubmitButton() {
        const { pending } = useFormStatus();
        return (
            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Logging in…" : "Login"}
            </Button>
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your API key to get started
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form action={saveApiKey}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="apikey">API Key</Label>
                                <Input id="apikey" name="apikey" type="password" required />
                            </div>

                            {/* uses the inner SubmitButton component */}
                            <SubmitButton />
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an API key?{" "}
                            <a
                                href="https://www.tailrix.com"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
