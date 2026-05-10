import { auth } from "@/lib/auth";
import Link from "next/link";
import { Map, Plane, Wallet, Sun, ArrowRight, ShieldCheck, Globe, Star } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600 font-display font-bold text-xl">
            <Plane className="h-6 w-6" />
            <span>Traveloop</span>
          </div>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium transition-colors text-sm shadow-lg shadow-teal-500/30"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-full font-medium transition-colors text-sm"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-4">
            <Star className="h-4 w-4 fill-current" />
            <span>The #1 Travel Planning App</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 leading-[1.1]">
            Plan your perfect <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">
              multi-city trip
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Organize itineraries, track budgets in real-time, and check live weather forecasts for all your destinations in one beautiful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={session?.user ? "/dashboard" : "/signup"}
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-lg shadow-xl shadow-teal-500/20 w-full sm:w-auto justify-center"
            >
              {session?.user ? "Enter Workspace" : "Start Planning for Free"}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-slate-900">10k+</p>
              <p className="text-sm text-slate-500 mt-1 font-medium uppercase tracking-wider">Trips Planned</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-slate-900">150+</p>
              <p className="text-sm text-slate-500 mt-1 font-medium uppercase tracking-wider">Countries Supported</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-slate-900">500k</p>
              <p className="text-sm text-slate-500 mt-1 font-medium uppercase tracking-wider">Activities Logged</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-slate-900">100%</p>
              <p className="text-sm text-slate-500 mt-1 font-medium uppercase tracking-wider">Free to Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">Everything you need in one place</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Stop juggling between spreadsheets, maps, and weather apps. Traveloop brings your entire itinerary together.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">Interactive Timeline</h3>
              <p className="text-slate-600 leading-relaxed">
                Drag and drop your activities into a beautiful, easy-to-read timeline. Perfect for visualizing your day-by-day journey across multiple cities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">Live Budget Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Track every expense in real-time. With built-in live currency conversion, you'll always know exactly how much you're spending in your home currency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">Live Weather Forecasts</h3>
              <p className="text-slate-600 leading-relaxed">
                Integrated OpenWeatherMap API provides live 5-day forecasts for all your destinations so you know exactly what to pack.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow md:col-span-3 lg:col-span-1 lg:col-start-2">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">Global City Lookup</h3>
              <p className="text-slate-600 leading-relaxed">
                Powered by GeoDB, instantly search and add any city in the world to your itinerary with precise geographic coordinates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 font-display font-bold text-lg mb-4 md:mb-0">
            <Plane className="h-5 w-5" />
            <span>Traveloop</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Traveloop. Built for travelers.
          </p>
        </div>
      </footer>
    </div>
  );
}
