import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Shield,
  TrendingUp,
  MapPin,
  Satellite,
  Cloud,
  Database,
  CheckCircle2,
  ArrowRight,
  IndianRupee,
  Users,
  AlertTriangle,
  Sparkles,
  Building2,
  Tractor
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl">AgriRisk Pro</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm font-medium hover:text-primary transition-colors">Problem</a>
            <a href="#solution" className="text-sm font-medium hover:text-primary transition-colors">Solution</a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/insurance">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/assess">
              <Button className="gradient-primary text-white shadow-lg">
                Get Risk Score
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 gradient-primary text-white px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Revolutionizing Crop Insurance in India
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Fair Insurance Through{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Data
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Every Farm Deserves Its Own Score
            </p>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Farm-level risk assessment that replaces outdated district-level pricing.
              Reduce loss ratios by 20%+ while offering fair premiums to farmers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/assess">
                <Button size="lg" className="gradient-primary text-white shadow-xl h-14 px-8 text-lg">
                  <Tractor className="h-5 w-5 mr-2" />
                  I'm a Farmer
                </Button>
              </Link>
              <Link href="/dashboard/insurance">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  <Building2 className="h-5 w-5 mr-2" />
                  I'm an Insurer
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>5 Data Sources</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Fraud Detection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                The Problem
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                India's Crop Insurance is Broken
              </h2>
              <p className="text-lg text-muted-foreground">
                Insurance companies lose ₹115-130 for every ₹100 collected
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">A</span>
                    </div>
                    Farmer A (Pune District)
                  </h3>
                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      10 acres with drip irrigation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      2 borewells, crop diversification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      LOW RISK profile
                    </li>
                  </ul>
                  <div className="p-3 bg-white rounded-lg">
                    <span className="text-2xl font-bold">₹5,000</span>
                    <span className="text-muted-foreground text-sm ml-2">Premium</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">B</span>
                    </div>
                    Farmer B (Same District)
                  </h3>
                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      2 acres, rainfed only
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Monocrop cotton
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      HIGH RISK profile
                    </li>
                  </ul>
                  <div className="p-3 bg-white rounded-lg">
                    <span className="text-2xl font-bold">₹5,000</span>
                    <span className="text-muted-foreground text-sm ml-2">SAME Premium!</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-red-300 bg-red-100">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium text-red-800">
                  Result: Good farmers subsidize bad farmers → Good farmers opt out →
                  Only high-risk farmers remain → <strong>Loss Spiral</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-4 gradient-primary text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Our Solution
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Farm-Level Precision Scoring
            </h2>
            <p className="text-lg text-muted-foreground">
              We combine 5+ data sources to give every farm a unique risk score
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
            {[
              { icon: Satellite, label: 'Satellite', detail: 'NDVI & Vegetation' },
              { icon: Cloud, label: 'Weather', detail: 'Forecast & History' },
              { icon: MapPin, label: 'Soil', detail: 'Quality & Moisture' },
              { icon: Database, label: 'KCC Data', detail: 'Loans & History' },
              { icon: TrendingUp, label: 'Market', detail: 'Prices & Trends' }
            ].map((source, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
                    <source.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold">{source.label}</h3>
                  <p className="text-xs text-muted-foreground">{source.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  With AgriRisk Pro
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span>Farmer A (Low Risk)</span>
                    <span className="font-bold text-green-600">₹2,800</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span>Farmer B (High Risk)</span>
                    <span className="font-bold text-red-600">₹7,200</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-green-700">
                  Fair pricing based on actual risk profile
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-300 bg-green-100">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-700 mb-2">20%+</div>
                  <p className="text-green-800 font-medium">Reduction in Loss Ratio</p>
                  <p className="text-sm text-green-700 mt-2">
                    From 115% to &lt;95% with precision risk pricing
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Key Features</Badge>
            <h2 className="text-4xl font-bold mb-4">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Multi-Source Fusion Engine',
                description: 'Combines 5+ data sources with ML-optimized weights for accurate, hard-to-game risk scores.'
              },
              {
                icon: AlertTriangle,
                title: 'Fraud Detection Layer',
                description: 'Automatically flags land inflation, fake irrigation claims, and anomalous loss reports.'
              },
              {
                icon: TrendingUp,
                title: 'Explainable AI',
                description: 'Transparent breakdown of every score. Farmers understand WHY they got their premium.'
              },
              {
                icon: Users,
                title: 'Progressive Trust System',
                description: 'Trust score improves over time with accurate data, reducing verification costs.'
              },
              {
                icon: Cloud,
                title: 'Real-Time Alerts',
                description: 'Proactive warnings for drought, pests, and weather risks before damage occurs.'
              },
              {
                icon: IndianRupee,
                title: 'Fair Premiums',
                description: 'Good farmers pay less. Bad farmers pay more. Simple, fair, and sustainable.'
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Insurance Operations?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join the future of precision agriculture insurance. Get started with a
            free risk assessment or request a demo for your insurance company.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assess">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
                Try Free Assessment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-white hover:bg-white/10">
              Request Enterprise Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-400" />
              </div>
              <span className="font-bold text-xl">AgriRisk Pro</span>
            </div>

            <p className="text-gray-400 text-sm">
              Fair Insurance Through Data. Every Farm Deserves Its Own Score.
            </p>

            <p className="text-gray-500 text-sm">
              © 2026 AgriRisk Pro. Built for India's Farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
