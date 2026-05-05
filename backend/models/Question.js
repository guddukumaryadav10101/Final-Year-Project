const handlePushToDB = async () => {
  // Sirf wahi questions uthao jisme text bhara hai
  const activeQuestions = manualQuestions.filter(q => q.text.trim() !== "");
  
  if (activeQuestions.length === 0) {
    return toast.error("Pehle sawaal toh likho bhai!");
  }

  setIsUploading(true);
  const loadingToast = toast.loading("Final Schema Sync...");

  try {
    const payload = {
      mockTestName: mockTestName, // Schema default "NIMCET MOCK TEST - 01" hai par yahan se confirm bhej rahe hain
      questions: activeQuestions.map(q => ({
        mockTestName: mockTestName,
        questionNumber: Number(q.questionNumber),
        text: q.text,
        options: q.options, // Schema expects exactly 4 strings
        correctAnswer: q.correctAnswer.toUpperCase(), // Match uppercase: true
        section: q.section, // MATHEMATICS, ANALYTICAL, COMPUTER, ENGLISH
        marks: {
          positive: 4,
          negative: 1
        }
      }))
    };

    const res = await fetch(`${BASE_URL}/api/questions/bulk`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-auth-token': localStorage.getItem('token') 
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("DB Locked & Loaded! 🚀", { id: loadingToast });
      setTimeout(() => router.push('/admin/manage-tests'), 1000);
    } else {
      // Agat abhi bhi Reject aaye, toh Console (F12) mein "REJECT REASON" dekho
      console.error("REJECT REASON:", result);
      toast.error(`Reject: ${result.msg || "Field Mismatch"}`, { id: loadingToast });
    }
  } catch (err) {
    toast.error("Network Fail! Backend check karo.", { id: loadingToast });
  } finally {
    setIsUploading(false);
  }
};