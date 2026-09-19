import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, CheckCircle2, Clock } from 'lucide-react';

export const CareersPage: React.FC = () => {
  const [careers, setCareers] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/v1/careers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCareers(data.data);
      });
  }, []);

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      careerId: selectedJob._id,
      jobTitle: selectedJob.title,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      coverLetter: formData.get('coverLetter')
    };

    const res = await fetch('/api/v1/careers/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-spice-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-spice-saffron font-bold text-xs uppercase tracking-widest block mb-2">
            Join Our Team
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-spice-brown">
            Build The Future Of Authentic Food
          </h1>
          <p className="text-sm text-spice-brown/80 mt-3">
            Explore career opportunities across R&D food technology, plant management, marketing, and supply chain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Openings List */}
          <div className="lg:col-span-2 space-y-4">
            {careers.map((job) => (
              <div key={job._id} className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-spice-saffron/15 text-spice-saffron font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                      {job.department}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-spice-brown mt-2">{job.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-5 py-2 bg-spice-red text-white font-bold text-xs rounded-full hover:bg-spice-red-dark"
                  >
                    Apply Now
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-spice-brown/60">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-spice-saffron" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-spice-saffron" /> {job.type}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-spice-saffron" /> Exp: {job.experience}</span>
                </div>

                <p className="text-xs text-spice-brown/80 leading-relaxed">{job.description}</p>
              </div>
            ))}
          </div>

          {/* Application Form Box */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-spice-brown/10 shadow-sm sticky top-28">
              <h3 className="font-serif font-bold text-xl text-spice-brown mb-4 border-b border-spice-brown/10 pb-3">
                Job Application Form
              </h3>

              {selectedJob ? (
                submitted ? (
                  <div className="text-center py-8 text-xs text-spice-brown space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="font-bold">Application Received!</p>
                    <p className="text-spice-brown/70">Our HR team will review your application for {selectedJob.title}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-spice-saffron block mb-2">Applying for: {selectedJob.title}</span>
                    </div>
                    <div>
                      <label className="font-bold uppercase text-spice-brown block mb-1">Full Name</label>
                      <input type="text" name="name" required className="w-full px-3 py-2 rounded-xl bg-spice-cream border border-spice-brown/20" />
                    </div>
                    <div>
                      <label className="font-bold uppercase text-spice-brown block mb-1">Email</label>
                      <input type="email" name="email" required className="w-full px-3 py-2 rounded-xl bg-spice-cream border border-spice-brown/20" />
                    </div>
                    <div>
                      <label className="font-bold uppercase text-spice-brown block mb-1">Phone</label>
                      <input type="tel" name="phone" required className="w-full px-3 py-2 rounded-xl bg-spice-cream border border-spice-brown/20" />
                    </div>
                    <div>
                      <label className="font-bold uppercase text-spice-brown block mb-1">Cover Letter / Note</label>
                      <textarea name="coverLetter" rows={3} className="w-full px-3 py-2 rounded-xl bg-spice-cream border border-spice-brown/20" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-spice-red text-white font-bold rounded-xl">
                      Submit Application
                    </button>
                  </form>
                )
              ) : (
                <p className="text-xs text-spice-brown/60 text-center py-8">Select a job position from the left to start your application.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
