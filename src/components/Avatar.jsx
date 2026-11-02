export default function Avatar({ user, size = "w-10" }) {
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  if (user?.image) {
    return (
      <div className="avatar">
        <div className={`${size} rounded-full ring ring-primary ring-offset-2 ring-offset-base-100`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.image} alt={user.name || "Profile"} referrerPolicy="no-referrer" />
        </div>
      </div>
    );
  }
  return (
    <div className="avatar avatar-placeholder">
      <div className={`${size} rounded-full bg-primary text-primary-content ring ring-primary ring-offset-2 ring-offset-base-100`}>
        <span className="font-bold">{initial}</span>
      </div>
    </div>
  );
}
