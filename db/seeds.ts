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
   
      <strong>🎄dolor sit amet, consectetur adipiscing elit!🐛</strong></span></p><p style="text-align:center;"><img src="https://storage.googleapis.com/mapforfevedeux/e4cbbd76370d6c25344218a62f27850ce328f2cb%2FIMG_20200117_145912.jpg" alt="undefined" style="height: undefined;width: undefined"/></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">sed do eiusmod tempor incididunt ut labore 🤔 ?</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">Lorem ipsum :</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">✅ Ut enim ad minim veniam</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">✅ quis nostrud exercitation</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">❎ ullamco laboris nisi</span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>"Duis aute irure dolor in reprehenderit in </em></span><a href="https://www.lipsum.com/" target="_self"><span style="font-size: 24px;font-family: Georgia;"><em>voluptate velit</em></span></a><span style="font-size: 24px;font-family: Georgia;"><em>. "</em></span></p><p style="text-align:center;"></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</em></span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut</em></span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;"><em>aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</em></span></p><p style="text-align:center;"><span style="font-size: 24px;font-family: Georgia;">Sunt in culpa qui officia deserunt mollit anim id est laborum.</span></p>`,
    },
  })
  const Tags = [
    "biodiversité",
    "mobilité douce",
    "social",
    "citoyenneté",
    "diversité",
    "inclusion",
    "parité H/F",
    "énergie",
    "déchets",
    "qualité de l air",
    "pollutions",
    "ressources",
    "eau",
    "alimentation",
    "jardins partagés",
    "dons",
    "démocratie",
    "débats",
    "bien-être",
    "qualité de vie au travail",
    "parentalité",
    "climat",
    "terres",
    "océans",
    "stratégie bas carbone",
    "décarbonation",
    "compensation carbone",
    "bilan carbone",
    "éthique",
    "éducation",
    "développement durable",
    "numérique",
    "solidarité",
    "mecenat competences",
    "santé",
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
