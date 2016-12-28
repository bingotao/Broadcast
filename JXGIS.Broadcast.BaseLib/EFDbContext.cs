using JXGIS.Broadcast.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.BaseLib
{
    public class EFDbContext : DbContext
    {
        public EFDbContext() : base((string)SystemUtility.Config.DbConStr)
        {
            this.Database.Initialize(false);
        }

        //重新OnModelCreating方法
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("dbo");
        }

        public DbSet<PublishedDetail> PublishedDetail { get; set; }

        public DbSet<CapturedInfo> CapturedInfo { get; set; }

        public DbSet<Feedback> Feedback { get; set; }

        public DbSet<ReportInfo> ReportInfo { get; set; }

        public DbSet<User> User { get; set; }
    }
}