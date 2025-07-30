import { Shield, Award, Users, Focus } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Timeline from "../components/about/Timeline";
import CompanyOverview from "../components/about/CompanyOverview";
import AnimatedElement from "../components/common/AnimatedElement";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow page-content">
        <AnimatedElement animation="fadeIn">
          <div>
            <PageHeader
              title="About DiveMix"
              description="Leading the industry in compressed air and gas solutions since 1990"
              backgroundImage="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=2000"
            />

            <div className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CompanyOverview />

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                    <p className="text-gray-600">
                      To be the global leader in innovative gas mixing solutions,
                      setting industry standards for quality, reliability, and
                      technological advancement.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-600">
                      To provide cutting-edge compressed air and gas solutions while
                      maintaining the highest standards of safety, quality, and
                      customer satisfaction.
                    </p>
                  </div>
                </div>

                {/* Core Values */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <Award className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Quality</h3>
                    <p className="text-gray-600">
                      We deliver German-engineered excellence, ensuring reliable and long-lasting performance.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <Focus className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                    <p className="text-gray-600">
                      We embrace new technologies to offer advanced, forward-thinking solutions.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <Users className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Customer-Focused</h3>
                    <p className="text-gray-600">
                      Your needs guide our approach, from personalized service to ongoing support.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <Shield className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Safety</h3>
                    <p className="text-gray-600">
                      We design every product with strict safety standards to ensure secure and dependable use.
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-20">
                  <h2 className="text-3xl font-bold text-center mb-12">
                    Our Journey
                  </h2>
                  <Timeline />
                </div>
              </div>
            </div>
          </div>
        </AnimatedElement>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}