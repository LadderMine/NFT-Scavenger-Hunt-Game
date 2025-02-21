import React from "react";

const page = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 text-white">
        <CardContent className="pt-6">
          <Alert className="bg-red-500/20 border-red-500/50">
            <AlertDescription>
              Please log in to view your profile.
            </AlertDescription>
          </Alert>
          <Button
            asChild
            className="mt-4 w-full bg-purple-500 hover:bg-purple-600">
            <Link href="/">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
