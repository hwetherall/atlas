Here are the things that we need to improve, tab by tab.

## Tab 1, Fact Bank

1. The calculations don't make much sense when I read them. For example, while reading the Calculation used to calculate the Swiss size, it gave me: Calculation · Top-down capacity apportionment
CH colo 274 MW ÷ CE-7 colo 3,451 MW (Statista 2025) = 0.079 → 0.08 (normalized)
✓ Installed-base method (Mordor 850.6 MW incl. self-operated) → ~0.13 — Swiss market is self-operation-heavy

I have read through this multiple times, and I still don't understand what it means. Let's focus on making this easier to understand, even if we have to simplify it.

2. When I click a fact bank row lower down, I have to scroll back up to see the box which explains everything.
3. I am not 100% convinced I want the key number to be a percentage; a $ symbol might be far more relevant. Seeing that Germany has a market size of 160m Euro is more useful than 50% (of what?). The percentage is super useful, so don't discard it. It just doesn't make the most sense to use I think.

## Tab 2: Dashboard

4. I think the dashboard could have a completely new rebuild, but let's park that for now. The basic idea, that we need to display the numbers in the fact bank visually, is important, and this is a potential wow moment we are missing out on, but for now, I don't know if this is the best possible use of our time. A yes but later task, and I think I might outsource it to Codex or Gemini, which is far better for design based tasks

## Tab 3: First Risk Pass

5. So one of the issues I have noticed is that we seem to be optimising for getting the best possible YAM number, but pretty quickly we realise that YAM is almost certainly going to be $0, so we should probably shift our attention somewhat to TAM and SAM. 

6. I love the "Rivals bundle PDUs" error, but I think it is more of a risk, than an error. At the same time, "Year 1 reach is two countries" feels like an error, not a risk.

7. The summary at the start is unreadable: "Every risk is a claim against a specific fact in the model, with a machine-readable perturbation — so its € impact is computed against your current levers, never asserted. 27 findings · 17 model errors to fix · 4 rocks · 19 backed by evidence · Σ expected YAM at risk €22.57M" I don't know what this means, and I wrote this app!

8. When I do a deep dive, there is a ton of boxes and information. Great! But it makes it really hard to digest. I think we need to streamline it, or at least put the most important parts first. When I want to look at a risk/error, I probably want the order to be a) brief description of the original factbank item that we have found a problem b) what the problem is that we found c) how this problem impacts us in the broader sense d) how we could fix this (plan of attack to research this) . This is probably the MVP goal, I wonder if there is a 5th category ("Innovera opinion", "Alternative Options", "Chat further" etc). Right now, there feels like a like a ton of boxes and info that have been shoe-horned in that serve to confuse, rather than illuminate

## Tab 4: Re-Research

9. This is a really good tab, however, I would rather have less examples but better ones. We should have four exemplar examples for each outcome: applied, folded in, deferred, refuted. I don't need three examples of applied, I need one REALLY good one that teaches me how the process works. Remember, this is a demo, not a production grade output. 

10. I think it would be great to have one risk, and one error, that we track across the entirety of the tabs. Because it makes no sense when I am presenting when I say "Oh, here is Risk A", and then move to a new tab and be like "Here we have corrected Risk B". Having a clear link means that the user can feel comfortable and put it all together.

11. While rewriting, making sure we make it clearer. The goal should be "Current state", "Risk/problem with premise", "Research conducted", "Findings", "What changed", "What next/now" (optional)

## Tab 5: What changed

12. This page will massively improve if we do much better with the Tab 4 improvements above. I will focus on improvements for this in V2 of this improvement loop. Skip for now unless anything is obvious. Make sure that we have the risks/errors that go all the way through shown. 

## Tab 6: New Dashboard

13. Keep for now unless anything obvious. We will fix in V2 once these first steps are done.

## Tab 7 Remaining Risks

14. Apply changes that we discuss in Tab 4. The key improvements I want to make at this stage is focussing on clarity and ease of presentation. We will come back to this.

## Tab 8: Next steps

15. The best tab, and one that needs the most help. Spend your most time here.

16. First off, we need to have a summary of what we are doing. This should give a summary of what we have done so far, which is research as much as possible until we have a market shape and size that we have been able to loop on until we are comfortable with the numbers. Once we have that, there are a number of risks that we can't solve with web research, and those one we can only solve with the Innovera Software Suite. This summary should ground the reader in what we have done, and what comes next.

17. The initial table is a bit confusing. Response makes sense, but  at stake and retires makes no sense. Think hard about how this table improves. Furthermore, the subheadings under each risk "The market won't wait for a tender that isn't coming" is a cool idea, and could work,but the execution is not good. 

18. The Innovera Toolkit is cool, but I don't understand Themis. It says it does Themis

Right order — risk governance

Records the conscious acceptance: the max-regret bound, the revisit triggers, the sunset date, and who signed it.

, but does it? Maybe just cut, Agent Ignore is a bit of a meme, and ultimately is rolled into Argus-lite. 

19. Delphi and Argus are great names but Daedalus and Mentor are not. I like something like Julius for Daedalus, named after the Roman leader who was very well known for acting boldly. For Mentor, it would be nice for you to pick a name. Perhaps a woman's name from Greek or Roman history, real or mythological

20. For the Act subtab, I want you to rewrite the Stakes. Right now it reads "The Year-1 number assumes buyers arrive steadily and can be won inside twelve months. But the chosen corner of the market is a handful of Frankfurt and Amsterdam campus fit-outs whose electrical bill of materials was frozen at tender, in 2024–25. The capacity delivering during the venture's first year has, for sales purposes, already happened. Every quarter spent pitching new-build tenders is a quarter of the only selling year the model counts." Sure, I kind of get it. But it could be written simpler and clearer, so I REALLY grasp the issue at hand. It gets even worse when we go to When it bites and The decision expires. It's barely understandable language. Worth thinking hard on about how we make this a coherent section.

21. The more I read this, the Act is actually pretty bad. The decision question is really long. The solution isn't clear. The stakes are unclear. I think scrap and pick a new risk (ideally one we have noodled on upstream) and then think about how this could be much stronger. Act is a critical part of our Demo, so I want it to land.

22. In Mentor, the Stakes is good, but a bit like it is selling it to me. I don't want that. Outline the issue, identify why web-research won't move the needle, then connect it to the Expert we want to use, and why. Give 1-3 other options as backups.

23. In Mentor, I think the main focus should be a filled out profile about Dr Anneke Vos. Include her background, location, where her expertise is. Have some fake CTA tools, like "Book Session" which triggers a popup where I can pick a time and date, or "Email" which pulls up a popup with a prefilled draft email. That second option replaces the Agenda point.

24. Just check your langauge a little. Clear, simple, solution orientated, risk focussed, not trying to sell, guide.

25. The Argus section is really good. Perhaps in V2 we could have a simulated example of Argus working in real time. For this tab to really land, I want the idea of "Here is the risk, here is what happens if things change, here is the way we will track it". And then just list the things we are tracking. For example, this is a really good task for monitoring EU regulations, so for example you could always track the Dutch Parliament to make sure any new legislation that goes through is instantly captured and then brought to attention.

26. For Buy information, I would love to just see the list of Market Research Reports, price, information you'll gain, and then a link to click through to it

