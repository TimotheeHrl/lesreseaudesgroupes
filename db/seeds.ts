import db from "./index"

interface IFistAdmin {
  role: string
}

const seed = async () => {
  const firstAdmin = (await db.user.findFirst({
    where: { email: "FirstAdminEmail" },
    select: { role: true },
  })) as IFistAdmin | null
  let firstAdminRole = typeof firstAdmin?.role
  if (firstAdminRole !== "string") {
    await db.user.create({
      data: {
        name: "FirstAdminName",
        email: "FirstAdminEmail",
        hashedPassword:
          "",
        isActive: true,
        emailIsVerified: true,
        userLat: 50.33,
        userLon: 3.33,
        ip: ["2E22"],
        role: "ADMIN",
        getNotifications: true,
        isPublic: true,
      },
    })
  } else {
    console.log("there is alrealdy a first admin")
  }

  await db.mainPage.create({
    data: {
      maincontent: `
   
      <strong>πdolor sit amet, consectetur adipiscing elit!π</strong></span></p><p style="text-align:center;"><img src="https://storage.googleapis.com/mapforfevedeux/e4cbbd76370d6c25344218a62f27850ce328f2cb%2FIMG_20200117_145912.jpg" alt="undefined" style="height: undefined;width: undefined"/></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">sed do eiusmod tempor incididunt ut labore π€ ?</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">Lorem ipsum :</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">β Ut enim ad minim veniam</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">β quis nostrud exercitation</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">β ullamco laboris nisi</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>"Duis aute irure dolor in reprehenderit in </em></span><a href="https://www.lipsum.com/" target="_self"><span style="font-size: 24px;font-family: Georgia;"><em>voluptate velit</em></span></a><span style="font-size: 24px;font-family: Georgia;"><em>. "</em></span></p><p style="text-align:center;"></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</em></span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut</em></span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</em></span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">Sunt in culpa qui officia deserunt mollit anim id est laborum.</span></p>`,
    },
  })
  const Tags = [
    "biodiversitΓ©",
    "mobilitΓ© douce",
    "social",
    "citoyennetΓ©",
    "diversitΓ©",
    "inclusion",
    "paritΓ© H/F",
    "Γ©nergie",
    "dΓ©chets",
    "qualitΓ© de l air",
    "pollutions",
    "ressources",
    "eau",
    "alimentation",
    "jardins partagΓ©s",
    "dons",
    "dΓ©mocratie",
    "dΓ©bats",
    "bien-Γͺtre",
    "qualitΓ© de vie au travail",
    "parentalitΓ©",
    "climat",
    "terres",
    "ocΓ©ans",
    "stratΓ©gie bas carbone",
    "dΓ©carbonation",
    "compensation carbone",
    "bilan carbone",
    "Γ©thique",
    "Γ©ducation",
    "dΓ©veloppement durable",
    "numΓ©rique",
    "solidaritΓ©",
    "mecenat competences",
    "santΓ©",
  ] as string[]
  for (let i = 0; i < Tags.length; i++) {
    const tag = Tags[i] as string
    await db.tag.create({
      data: {
        id: tag as string,
        catSpecific: "ctag",
      },
    })
  }
}

export default seed
