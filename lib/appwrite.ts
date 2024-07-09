import { Client, Account, ID, Avatars, Databases, Query, Storage, ImageGravity } from 'react-native-appwrite';

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.sabah.bliss",
  projectId: "6658437e002d325c7813",
  storageId: "6658478000234ccd8c29",
  databaseId: "665845050039ccecf4c2",
  userCollectionId: "6658454f003a59977a56",
  videoCollectionId: "665845ac002a63dfd6b4",
};

const client = new Client()
client.setEndpoint(config.endpoint)
client.setProject(config.projectId)
client.setPlatform(config.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client);

const createUser = async (email: string, password: string, username: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username)
    if (!newAccount) throw new Error("Account Creation Failed!")
    const avatarUrl = avatars.getInitials(username)
    await signIn(email, password)
    const newUser = await databases.createDocument(config.databaseId, config.userCollectionId, ID.unique(), {
      email,
      username,
      avatar: avatarUrl,
      accountId: newAccount.$id

    })
    return newUser
  } catch (err: any) {
    console.log(err)
    throw new Error(err)
  }
}

const signIn = async (email: string, password: string) => {
  try {
    await account.createEmailPasswordSession(email, password)
  } catch (err: any) {
    throw new Error(err)
  }
}
// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error: any) {
    throw new Error(error);
  }
}
async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    // console.log(currentAccount)
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
// Sign Out
async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}
// Upload File
export async function uploadFile(file: any, type: any) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}
// Get File Preview
export async function getFilePreview(fileId: string, type: string) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Center,
        100

      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}
// Create Video Post
export async function createVideoPost(form: any) {
  if (form?.userId) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
      const newPost = await databases.createDocument(
        config.databaseId,
        config.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator:[form.userId],
        }
      );

      return newPost;
    } catch (error: any) {
      throw new Error(error);
    }
  }else{
    throw new Error("No UserId Found")
  }

}
// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );
    // console.log(posts.documents)
    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}
// Get video posts created by user
export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    // console.log("latest",posts.documents)
    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}
export { createUser, signIn, getCurrentUser, signOut }