import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Leaf, Camera, Map, TrendingUp, Shield, Users } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container relative z-10 px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl">
              AI-Powered Crop Disease Diagnosis
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Protect your crops with instant AI diagnosis, real-time disease tracking, and expert treatment recommendations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="bg-background text-foreground hover:bg-background/90">
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Simple, fast, and accurate disease diagnosis in three easy steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="shadow-card hover:shadow-lg-custom transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                  <Camera className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">1. Upload Photo</h3>
                <p className="text-muted-foreground">
                  Take a photo of your affected crop and upload it to our platform
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-lg-custom transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">2. AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI instantly analyzes the image and identifies the disease with high accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-lg-custom transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">3. Get Treatment</h3>
                <p className="text-muted-foreground">
                  Receive detailed treatment recommendations and preventive measures
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Why Choose AgriDiagnose
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Accurate Diagnosis</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered analysis with 95%+ accuracy rate
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                <Map className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Disease Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive map showing disease spread in your region
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Access to agricultural experts for complex cases
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications on disease outbreaks
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Treatment Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed, step-by-step treatment instructions
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                <Camera className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">Easy to Use</h3>
                <p className="text-sm text-muted-foreground">
                  Simple interface designed for farmers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <Card className="bg-gradient-hero shadow-lg-custom">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                Ready to Protect Your Crops?
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/90">
                Join thousands of farmers using AI to safeguard their harvests
              </p>
              <Button size="lg" asChild className="bg-background text-foreground hover:bg-background/90">
                <Link to="/register">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};
