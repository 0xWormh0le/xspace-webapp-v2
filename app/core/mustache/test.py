onboarding = {"step1":False,"step2":True,"step3":True,"step4":True}

# dictfilt = lambda x, y: dict([ (i,x[i]) for i in x if i in set(y) ])
#
# wanted_keysA = dictfilt(onboarding,("step1","step2"))
#
# wanted_keysB = dictfilt(onboarding,("step3","step4"))
#
# enabledA=all(value == True for value in wanted_keysA.values())
#
# enabledB=all(value == True for value in wanted_keysB.values())
#
# print(enabledA)
# print(enabledB)

print(onboarding["step1"]and onboarding["step2"])
print(onboarding["step3"]and onboarding["step4"])