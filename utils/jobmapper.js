export function mapJobs(jobs) {
  return jobs.map((job, index) => {
    const highlights = job.job_highlights || [];

    // Helper function to safely extract highlight by keyword
    const findHighlight = (keyword) =>
      highlights.find(
        (h) => h.title && h.title.toLowerCase().includes(keyword)
      );

    const qualifications = findHighlight("qualification");
    const responsibilities = findHighlight("responsibilit"); 
    const benefits = findHighlight("benefit");

    let arrangement = "Onsite"; // default
    const locationText = job.location?.toLowerCase() || "";
    if (locationText.includes("remote")) {
      arrangement = "Remote";
    } else if (locationText.includes("hybrid")) {
      arrangement = "Hybrid";
    }


    let salary = "Not specified";
    if (job.detected_extensions?.salary) {
      salary = job.detected_extensions.salary;
    } else if (job.detected_extensions?.base_salary) {
      salary = job.detected_extensions.base_salary;
    } else if (job.detected_extensions?.estimated_salary) {
      salary = job.detected_extensions.estimated_salary;
    }


    return {
      id: index.toString(),
      title: job.title || "Untitled",
      logo: job.thumbnail || null,
      logo_alt: job.title?.charAt(0) || "?",
      company: job.company_name || "Unknown Company",
      location: job.location || "N/A",
      arrangement,
      salary,
      sched: job.detected_extensions.schedule_type || "Unknown",
      postDate: job.detected_extensions?.posted_at || "N/A",
      description: job.description || "No description available",
      qualifications: qualifications?.items || [],
      responsibilities: responsibilities?.items || [],
      benefits: benefits?.items || [],
      apply_opts: job.apply_options || [],
      source: job.via || "",
    };
  });
}
