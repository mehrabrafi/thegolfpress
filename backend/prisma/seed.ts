import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMG = 'https://cdn.thegolfpress.com/d43609c4-2ebc-4da7-a2b4-6fc3d03c1a15.webp';

// Constants for Guides & Courses
const GUIDE_CATEGORY_TAGS = ['Swing Sequence', 'Short Game', 'Putting', 'Driving', 'Fitness', 'Mental Game', 'Beginners'];
const COURSE_LOCATIONS = ['Scotland', 'USA', 'Spain', 'England', 'Ireland', 'Portugal', 'Australia', 'Japan', 'South Africa', 'Canada'];

async function main() {
    console.log('Seeding real articles, guides, and course reviews...');

    // 1. Existing Standard Articles
    const newsData = [
        // ═══════════════════ TOURNAMENT ═══════════════════
        {
            id: 'tour-1', type: 'FEATURED', category: 'TOURNAMENT', categoryTag: 'THE MASTERS',
            title: "Scottie Scheffler Wins His Second Green Jacket at Augusta National",
            excerpt: "World No. 1 Scottie Scheffler delivered a masterclass in ball-striking to claim his second Masters title, finishing four strokes clear of the field at Augusta National.",
            time: '2 hours ago', image: IMG,
            content: `<p>Scottie Scheffler cemented his status as the dominant force in men's golf by capturing his second Masters title in commanding fashion at Augusta National Golf Club. The 27-year-old Texan fired a final-round 68 to finish at 11-under par, four strokes ahead of Ludvig Åberg and Collin Morikawa.</p><p>Scheffler's victory was built on a week of extraordinary ball-striking. He led the field in greens in regulation at 83% and ranked second in strokes gained: approach. His tee-to-green game was virtually flawless, navigating Augusta's treacherous contours with a precision that left even his fellow competitors in awe.</p><p>"This place means everything to me," an emotional Scheffler said during the green jacket ceremony. "To win here once is a dream. To do it twice is something I can't even put into words."</p><p>The turning point came on the par-5 13th hole on Saturday, where Scheffler hit a towering 4-iron over Rae's Creek to set up a two-putt eagle that gave him a three-shot cushion heading into Sunday. From there, he never looked back, playing the final 24 holes bogey-free.</p><p>Åberg, the 24-year-old Swede in just his second Masters appearance, impressed with a closing 66 that included an eagle on the 15th. Morikawa continued his strong major championship form with a 67.</p>`
        },
        // ... (keep all existing manual entries)
        {
            id: 'tour-2', type: 'REGULAR', category: 'TOURNAMENT', categoryTag: 'PGA TOUR',
            title: "Rory McIlroy Ends Major Drought with Dramatic U.S. Open Victory at Pinehurst",
            excerpt: "After a decade-long wait, Rory McIlroy finally captured his fifth major championship with a stunning final-round 65 at Pinehurst No. 2.",
            time: '5 hours ago', image: IMG,
            content: `<p>Rory McIlroy silenced years of doubt and heartbreak by winning the 2025 U.S. Open at Pinehurst No. 2, claiming his fifth major championship and his first since 2014. The Northern Irishman produced a sensational closing 65, the lowest round of the day, to overtake overnight leader Bryson DeChambeau and win by two strokes.</p><p>McIlroy birdied four of his final six holes, including a dagger of a putt from 18 feet on the 72nd hole that sent the galleries into a frenzy. "I've worked so hard for this moment," McIlroy said, tears streaming down his face. "There were times I wondered if it would ever happen again."</p><p>The victory completed the career Grand Slam for a second time for McIlroy, making him only the sixth player in history to achieve the feat. His final-round heroics recalled memories of his dominant 2011 U.S. Open win at Congressional, where he won by eight shots as a 22-year-old.</p><p>DeChambeau, who led by two shots entering the final round, faltered with a double bogey on the 15th hole that proved decisive. He finished tied for second with Xander Schauffele at 5-under par.</p>`
        },
        {
            id: 'tour-3', type: 'REGULAR', category: 'TOURNAMENT', categoryTag: 'PGA TOUR',
            title: "Xander Schauffele Claims The Open Championship at Royal Troon",
            excerpt: "Olympic gold medalist Xander Schauffele added a Claret Jug to his collection with a wire-to-wire victory at Royal Troon in Scotland.",
            time: '1 day ago', image: IMG,
            content: `<p>Xander Schauffele produced one of the most dominant displays in Open Championship history, leading from start to finish to capture his first Claret Jug at Royal Troon. The American finished at 15-under par, six strokes ahead of runner-up Tommy Fleetwood.</p><p>Schauffele opened with a course-record 62 on Thursday and never relinquished his lead, becoming only the seventh player to lead after every round at The Open. His ball-striking in the Scottish winds was a thing of beauty, finding 58 of 72 greens in regulation across the four rounds.</p><p>"Links golf brings out the best in me," Schauffele explained. "I love the creativity it demands. You have to think your way around these courses, and I felt sharp all week."</p><p>Fleetwood thrilled the home crowd with a closing 65 to secure solo second, while defending champion Brian Harman tied for third with Viktor Hovland at 7-under par.</p>`
        },
        {
            id: 'tour-4', type: 'REGULAR', category: 'TOURNAMENT', categoryTag: 'PGA TOUR',
            title: "Wyndham Clark Defends His Players Championship Title at TPC Sawgrass",
            excerpt: "In a dramatic finish at the iconic island green, Wyndham Clark sank a 12-foot birdie putt on 17 to defend his Players Championship title.",
            time: '2 days ago', image: IMG,
            content: `<p>Wyndham Clark became the first player to successfully defend The Players Championship title since its inception, producing a clutch birdie on the famous par-3 17th hole at TPC Sawgrass to seal a one-shot victory over Scottie Scheffler.</p><p>Clark's 12-foot birdie putt on the island green, struck with ice-cold confidence as the pressure mounted, will go down as one of the great moments in Players Championship history. He followed it with a conservative par on 18 to finish at 16-under par.</p><p>"I love this golf course," Clark said. "The 17th hole either makes you or breaks you, and today it made me. I had a great read on that putt and just trusted my stroke."</p><p>Scheffler, who needed an eagle on 18 to force a playoff, came up short with his approach and settled for a birdie and solo second at 15-under. Jordan Spieth and Collin Morikawa shared third place at 13-under.</p>`
        },
        {
            id: 'tour-5', type: 'REGULAR', category: 'TOURNAMENT', categoryTag: 'PGA TOUR',
            title: "Viktor Hovland Captures Arnold Palmer Invitational at Bay Hill",
            excerpt: "The Norwegian star rolled in a 22-foot eagle putt on the final hole to win the Arnold Palmer Invitational by one shot.",
            time: '3 days ago', image: IMG,
            content: `<p>Viktor Hovland produced a moment of pure magic on the 72nd hole at Bay Hill, draining a 22-foot eagle putt to steal the Arnold Palmer Invitational from the jaws of Patrick Cantlay. The dramatic finish gave Hovland a final-round 66 and an 18-under total, one better than Cantlay who had been leading in the clubhouse.</p><p>"My heart was pounding so hard I could barely see the line," Hovland admitted with a grin. "I just hit it and hoped for the best. When it dropped, I went blank for a second."</p><p>The victory marked Hovland's seventh PGA Tour win and his first in over a year, ending a stretch of near-misses that had tested his patience. His iron play was exceptional all week, ranking first in the field in strokes gained: approach at +7.2.</p>`
        },
        {
            id: 'tour-6', type: 'REGULAR', category: 'TOURNAMENT', categoryTag: 'DP WORLD TOUR',
            title: "Robert MacIntyre Wins BMW PGA Championship at Wentworth",
            excerpt: "Scottish fan favorite Robert MacIntyre held off a charging Jon Rahm to win the flagship event of the DP World Tour.",
            time: '4 days ago', image: IMG,
            content: `<p>Robert MacIntyre wrote another glorious chapter in Scottish golf history by winning the BMW PGA Championship at Wentworth Club. The left-hander from Oban fired a closing 67 to finish at 19-under par, two shots clear of Jon Rahm and Shane Lowry.</p><p>MacIntyre's victory was a triumph of consistency and mental fortitude. He didn't make a bogey over his final 36 holes, navigating Wentworth's demanding Burma Road course with precision. His putting was particularly impressive, ranking first in the field in strokes gained: putting at +8.4 for the week.</p><p>"Winning the BMW PGA is massive for me and for Scottish golf," MacIntyre said. "Wentworth is one of the great courses in the world, and to put my name on this trophy alongside so many legends is incredible."</p>`
        },
        {
            id: 'break-1', type: 'REGULAR', category: 'BREAKING', categoryTag: 'PGA TOUR',
            title: "PGA Tour and LIV Golf Reach Historic Unification Agreement",
            excerpt: "After two years of bitter rivalry, the PGA Tour and LIV Golf have agreed to merge operations under a new unified structure that will reshape professional golf.",
            time: '30 min ago', image: IMG,
            content: `<p>In what may be the most significant development in professional golf since the formation of the PGA Tour itself, the PGA Tour and LIV Golf have reached a comprehensive unification agreement. The deal, brokered over months of intensive negotiations, will see both entities merge into a single, global tour structure by 2026.</p><p>Under the terms of the agreement, LIV Golf's team-based format will continue as a separate but integrated series within the new structure. PGA Tour events will maintain their traditional individual stroke-play format, but players will be free to compete in both.</p><p>PGA Tour Commissioner Jay Monahan and LIV Golf CEO Greg Norman issued a joint statement: "This agreement is about the future of golf. By coming together, we can offer fans the best possible product and give players unprecedented opportunities."</p><p>The deal includes the creation of a new equity structure that will give players a significantly larger share of revenues. Prize money across all events is expected to increase by 40% within the first two years of the merger.</p>`
        },
        {
            id: 'break-2', type: 'REGULAR', category: 'BREAKING', categoryTag: 'LIV GOLF',
            title: "Jon Rahm's Team Legion XIII Signs Record-Breaking Sponsorship Deal",
            excerpt: "The Spanish star's LIV Golf franchise has secured a multi-year partnership reportedly worth over $100 million with a major global brand.",
            time: '1 hour ago', image: IMG,
            content: `<p>Jon Rahm's LIV Golf franchise, Team Legion XIII, has announced a landmark sponsorship agreement with luxury automotive brand that is reportedly worth in excess of $100 million over five years. The deal represents the largest commercial partnership in the history of team golf.</p><p>The sponsorship will include prominent branding on team uniforms, equipment, and facilities, as well as a series of exclusive events and content collaborations. Rahm himself will serve as a global brand ambassador as part of the arrangement.</p><p>"This partnership validates what we've been building with Legion XIII," Rahm said during the announcement in Madrid. "We're not just a golf team—we're a global sports brand, and this deal reflects that ambition."</p><p>The agreement is seen as a major milestone for LIV Golf's franchise model, which has struggled to attract blue-chip sponsors since its controversial launch. Industry analysts suggest the deal could pave the way for similar partnerships across other LIV teams.</p>`
        },
        {
            id: 'break-3', type: 'REGULAR', category: 'BREAKING', categoryTag: 'TRANSFER',
            title: "Tiger Woods Named Captain of 2025 United States Ryder Cup Team",
            excerpt: "The 15-time major champion will lead Team USA at Bethpage Black in what promises to be one of the most anticipated Ryder Cups in history.",
            time: '3 hours ago', image: IMG,
            content: `<p>Tiger Woods has been officially named captain of the 2025 United States Ryder Cup team, fulfilling a long-anticipated appointment that has electrified the golf world. Woods will lead Team USA at Bethpage Black in New York, a venue where he won the 2002 U.S. Open by three shots.</p><p>"Being named Ryder Cup captain is one of the greatest honors I've received in golf," Woods said. "Bethpage is a special place for me, and I can't wait to lead our team in front of those incredible New York fans."</p><p>PGA of America President John Lindert praised the selection: "Tiger Woods is the most iconic figure in golf history. His competitive fire, his knowledge of the game, and his leadership qualities make him the ideal captain for what will be a historic event."</p><p>Woods is expected to announce his vice-captains in the coming months, with Justin Thomas, Jordan Spieth, and Fred Couples widely rumored to be among his selections.</p>`
        },
        {
            id: 'break-4', type: 'REGULAR', category: 'BREAKING', categoryTag: 'INJURY',
            title: "Brooks Koepka Withdraws from PGA Championship Due to Knee Surgery",
            excerpt: "The five-time major winner will miss the PGA Championship after undergoing surgery to repair ligament damage in his left knee.",
            time: '6 hours ago', image: IMG,
            content: `<p>Brooks Koepka has been forced to withdraw from the upcoming PGA Championship after undergoing arthroscopic surgery on his left knee to repair a torn meniscus. The five-time major winner is expected to miss approximately eight to twelve weeks of competition.</p><p>"Obviously I'm disappointed," Koepka said in a statement released by his management team. "The PGA Championship is a tournament I've had a lot of success at, and I was looking forward to competing. But my long-term health has to come first."</p><p>Koepka, who has won the PGA Championship twice (2018, 2019), had been battling knee discomfort for several months. He withdrew from last month's WGC-Match Play after his opening match, citing knee pain.</p><p>His surgeon, Dr. Neal ElAttrache, released a statement confirming the procedure went smoothly: "Brooks tolerated the surgery well, and we expect a full recovery. He should be back competing within three months."</p>`
        },
        {
            id: 'break-5', type: 'REGULAR', category: 'BREAKING', categoryTag: 'BUSINESS',
            title: "Augusta National Announces Major Course Renovation Ahead of 2026 Masters",
            excerpt: "The home of the Masters will undergo significant changes including a lengthened 13th hole and redesigned 5th hole, with plans revealed today.",
            time: '8 hours ago', image: IMG,
            content: `<p>Augusta National Golf Club has announced sweeping renovations that will be completed before the 2026 Masters Tournament. The changes represent the most significant alteration to the iconic course in over a decade.</p><p>The centerpiece of the renovation is the par-5 13th hole, Azalea, which will be extended by 35 yards to play at 545 yards. New tee boxes have been constructed to the left of the current teeing ground, changing the angle of attack and restoring the strategic challenge of the dogleg left.</p><p>Chairman Fred Ridley explained the rationale: "Technology has changed the way elite players approach the 13th hole. By lengthening it and altering the angle, we're ensuring that the risk-reward nature of this great hole is preserved for future generations."</p><p>Additional changes include a complete redesign of the 5th green complex and the addition of new spectator areas around Amen Corner to accommodate growing galleries.</p>`
        },
        {
            id: 'equip-1', type: 'REGULAR', category: 'EQUIPMENT', categoryTag: 'DRIVERS',
            title: "TaylorMade Qi35 Driver Review: The Most Forgiving Driver Ever Made?",
            excerpt: "Our comprehensive test of the new TaylorMade Qi35 reveals remarkable ball speed retention on off-center strikes and a surprisingly workable ball flight.",
            time: '1 day ago', image: IMG,
            content: `<p>TaylorMade's new Qi35 driver has been generating enormous buzz since its announcement, and after three weeks of extensive testing, we can confirm that the hype is largely justified. The Qi35 represents a significant leap forward in forgiveness technology.</p><p>Our Trackman testing with 12 golfers of varying handicaps revealed an average ball speed loss of just 3.2 mph on strikes one inch from center—the best figure we've ever recorded. For comparison, last year's Qi10 averaged 4.8 mph loss in the same test.</p><p>The secret lies in TaylorMade's new Infinity Carbon Crown, which is 15% lighter than its predecessor, allowing engineers to redistribute weight lower and deeper in the head. The result is a higher MOI (moment of inertia) that resists twisting on mis-hits.</p><p>Sound and feel have also been refined. The Qi35 produces a satisfying, muted "thwack" at impact that our testers universally preferred to the slightly metallic tone of the Qi10. Adjustability remains excellent with the proven 12-position loft sleeve.</p><p>At $599, it's a premium investment, but for golfers seeking maximum forgiveness without sacrificing distance, the Qi35 sets a new benchmark.</p>`
        },
        {
            id: 'equip-2', type: 'REGULAR', category: 'EQUIPMENT', categoryTag: 'IRONS',
            title: "Titleist T350 Irons: Game-Improvement Meets Tour Performance",
            excerpt: "Titleist bridges the gap between forgiveness and feel with the new T350 irons, featuring AI-designed faces and tungsten weighting.",
            time: '2 days ago', image: IMG,
            content: `<p>Titleist has unveiled the T350 irons, a new entry in their iron lineup that sits between the game-improvement T400 and the players' T200. The T350 is designed for mid-handicap golfers who want forgiveness without sacrificing the look and feel that Titleist is known for.</p><p>The T350 features an AI-designed face that optimizes ball speed across the hitting area. Each iron in the set has a unique face thickness pattern, calculated using machine learning algorithms that processed over 100,000 impact points. The result is consistent distance gapping and improved performance on off-center strikes.</p><p>Tungsten weighting in the long irons (3-7) positions the center of gravity low and deep for higher launch, while the short irons feature a more compact head with less offset for improved shot shaping.</p><p>In our testing, the T350 delivered an average of 7 yards more carry distance than the outgoing T300, with a tighter dispersion pattern. The feel at impact is surprisingly soft for a game-improvement iron, thanks to a polymer insert behind the face.</p>`
        },
        {
            id: 'equip-3', type: 'REGULAR', category: 'EQUIPMENT', categoryTag: 'PUTTERS',
            title: "Scotty Cameron Super Select 2025 Putters: A Return to Classic Design",
            excerpt: "Cameron's latest lineup strips back the tech and focuses on what matters most—feel, alignment, and craftsmanship.",
            time: '3 days ago', image: IMG,
            content: `<p>Scotty Cameron's 2025 Super Select putters represent a philosophical shift for the legendary putter maker. Rather than packing in more technology, Cameron has simplified the design to create putters that emphasize feel, sound, and visual elegance.</p><p>The lineup features six models: three blades (Newport, Newport 2, Newport 2.5) and three mallets (Fastback 1.5, Squareback 2, and the new Del Mar). Each is milled from a single block of 303 stainless steel, ensuring consistency and that signature Cameron feel.</p><p>The most notable change is the return to a traditional face milling pattern. Cameron has abandoned the multi-material face inserts of recent years in favor of a deep-milled face that provides exceptional feedback on every stroke.</p><p>"Golfers told me they missed the pure feel of steel on the face," Cameron explained. "So I went back to basics. These putters are about giving the player confidence and feedback."</p><p>Pricing starts at $449 for the blade models and $449 for the mallets. Custom options including custom paint fills and grip choices are available through Titleist's online customization portal.</p>`
        },
        {
            id: 'equip-4', type: 'REGULAR', category: 'EQUIPMENT', categoryTag: 'BALLS',
            title: "Callaway Chrome Tour X: The Ball That's Changing the Pro Game",
            excerpt: "With over 50 tour wins worldwide, the Chrome Tour X is the fastest-growing ball on professional tours. We find out why.",
            time: '4 days ago', image: IMG,
            content: `<p>The Callaway Chrome Tour X has quietly become one of the most successful golf balls in professional golf, with over 50 wins worldwide across the PGA Tour, DP World Tour, and LPGA Tour. Our deep-dive testing explains why it's gaining such rapid adoption.</p><p>The four-piece construction features a large, high-energy core wrapped in a graphene-infused mantle layer that optimizes spin separation between driver and iron shots. Off the driver, we recorded an average spin rate of 2,180 rpm—exceptionally low for a tour ball. With wedges from 80 yards, spin jumped to 9,400 rpm with excellent check and grab.</p><p>The seamless Tour Aero design reduces drag by 4% compared to a conventional dimple pattern, resulting in a more penetrating ball flight that holds its line in crosswinds. Our wind tunnel testing confirmed measurable improvements in stability.</p><p>At $52.99 per dozen, it's priced competitively with the Titleist Pro V1x and TaylorMade TP5x. For golfers seeking maximum distance off the tee without sacrificing short-game spin, the Chrome Tour X delivers a compelling package.</p>`
        },
        {
            id: 'equip-5', type: 'REGULAR', category: 'EQUIPMENT', categoryTag: 'GEAR',
            title: "Best Golf GPS Watches of 2025: Garmin, Apple Watch, and More Tested",
            excerpt: "We tested seven leading GPS golf watches across 30 rounds to find the best option for every type of golfer and budget.",
            time: '5 days ago', image: IMG,
            content: `<p>GPS technology continues to revolutionize how golfers navigate the course. We spent three months testing seven GPS golf watches across 30 rounds at 15 different courses to determine which offers the best combination of accuracy, features, and value.</p><p>The Garmin Approach S70 (46mm) emerged as our top overall pick. Its full-color AMOLED touchscreen is stunning in direct sunlight, and its distance accuracy was consistently within one yard of our laser readings. The built-in virtual caddie feature, which factors in wind, elevation, and your personal shot patterns, proved remarkably useful for club selection.</p><p>For Apple Watch users, the Golfshot Pro app combined with Apple Watch Ultra 2 offers an excellent experience with over 45,000 preloaded courses and Apple's superior fitness tracking integration.</p><p>Budget-conscious golfers should consider the Garmin Approach S12 at $199, which sacrifices the color screen and advanced analytics but delivers rock-solid GPS distances and an impressive battery life of 30 hours in GPS mode.</p>`
        },
        {
            id: 'guide-1', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Swing Sequence',
            title: "The Perfect Backswing: How to Load Power Without Losing Control",
            excerpt: "Tour coach Sean Foley breaks down the three checkpoints every golfer needs in their backswing to generate maximum power with consistency.",
            time: '1 day ago', image: IMG,
            content: `<p>The backswing is where power is stored, and getting it right is essential for consistent ball-striking. Tour coach Sean Foley identifies three critical checkpoints that every golfer should master.</p><p><strong>Checkpoint 1: The Takeaway (Club parallel to the ground)</strong></p><p>The clubhead should be outside your hands with the face matching your spine angle. A common mistake is rolling the wrists, which fans the face open and requires a compensation on the downswing. Think of pushing the club back with your chest, keeping the triangle formed by your arms and shoulders intact.</p><p><strong>Checkpoint 2: The Halfway Point (Left arm parallel to the ground)</strong></p><p>At this point, your wrists should be fully hinged, creating a 90-degree angle between your left forearm and the club shaft. Your left shoulder should be under your chin, and your weight should have shifted to your right heel. The clubface should point roughly at the ball—if it points skyward, you've cupped your wrist excessively.</p><p><strong>Checkpoint 3: The Top</strong></p><p>Your back should face the target, with your left shoulder behind the ball. The club should be pointing parallel to the target line or slightly left of it. You should feel tension in your core and right glute—this is the "loaded" position from which power is unleashed on the downswing.</p><p>Practice each checkpoint in slow motion using a mirror until the positions feel natural, then gradually increase speed.</p>`
        },
        {
            id: 'guide-2', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Short Game',
            title: "Hinge and Hold: The Tour Player's Secret to Perfect Chipping",
            excerpt: "Learn the technique that transformed Luke Donald's short game and can shave five strokes off your handicap within a month.",
            time: '2 days ago', image: IMG,
            content: `<p>The "hinge and hold" technique is arguably the most effective chipping method in golf, used by tour players from Luke Donald to Jordan Spieth. It creates consistent, crisp contact with predictable trajectory and spin.</p><p><strong>The Setup:</strong> Position the ball in the center of a narrow stance with 60% of your weight on your front foot. Lean the shaft forward so your hands are ahead of the ball. Your grip pressure should be firm—about 7 out of 10.</p><p><strong>The Hinge:</strong> Take the club back by hinging your wrists early. The butt end of the club should point at your left hip by the time your hands reach waist height. This creates the leverage needed for crisp contact.</p><p><strong>The Hold:</strong> On the downswing, maintain the angle in your wrists through impact. The key word is "hold"—resist the urge to flip or release the clubhead past your hands. Your follow-through should be short, with the shaft still leaning forward post-impact.</p><p><strong>The Drill:</strong> Place a towel two inches behind the ball. If you're executing properly, you'll strike the ball cleanly without disturbing the towel. Practice this for 15 minutes daily, and within a month, your chipping will transform.</p>`
        },
        {
            id: 'guide-3', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Putting',
            title: "3 Pro Drills for Bulletproof Distance Control on the Greens",
            excerpt: "Distance control, not line, is the number one factor in reducing three-putts. These three drills will have you lagging it close every time.",
            time: '3 days ago', image: IMG,
            content: `<p>Statistics show that 90% of three-putts are caused by poor distance control, not misreads. These three tour-proven drills will calibrate your speed and eliminate those round-killing three-putts.</p><p><strong>Drill 1: The Ladder Drill</strong></p><p>Place tees at 15, 25, 35, and 45 feet from your starting position. Hit one ball to each tee, trying to stop each ball within three feet. The goal is to complete the ladder without any ball finishing more than a club-length past or short of its target. This builds feel across a range of distances.</p><p><strong>Drill 2: The Manilla Folder Drill</strong></p><p>Open a manilla folder and place it on the green at 30 feet. Your goal is to land the ball on the folder. This teaches you to focus on a landing zone rather than the hole, which is the key to distance control on longer putts.</p><p><strong>Drill 3: Eyes Closed Putting</strong></p><p>Set up to a 20-foot putt, take your last look at the hole, then close your eyes and stroke the putt. After hitting, guess where the ball stopped before opening your eyes. This drill sharpens your internal sense of speed and removes the tendency to guide the putter.</p>`
        },
        {
            id: 'guide-4', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Driving',
            title: "How to Hit a Power Draw That Adds 20 Yards to Your Drives",
            excerpt: "The controlled draw is the most powerful shot shape in golf. Here's how to groove a repeatable draw that maximizes distance off the tee.",
            time: '4 days ago', image: IMG,
            content: `<p>A draw adds distance because it launches with lower spin and rolls out more than a fade. Tour players average 12-15 yards more carry with a draw versus a fade. Here's how to hit one consistently:</p><p><strong>Step 1: Strengthen Your Grip</strong></p><p>Rotate both hands clockwise on the grip (for right-handers) until you can see three knuckles on your left hand at address. This pre-sets the face in a slightly closed position, which is essential for producing right-to-left spin.</p><p><strong>Step 2: Aim Your Body Right</strong></p><p>Align your feet, hips, and shoulders 10-15 yards right of your target. This creates a swing path that travels from inside to outside relative to the target line—the path component of the draw equation.</p><p><strong>Step 3: Swing Along Your Body Line</strong></p><p>Swing the club along your body line, not at the target. Trust that the slightly closed face will bring the ball back to the target. Feel as if you're hitting a shot to right field in baseball.</p><p><strong>Step 4: Finish High</strong></p><p>Your follow-through should be high and right of your target. If your follow-through wraps around your body too quickly, the ball will hook rather than draw. Think "high hands" at the finish.</p>`
        },
        {
            id: 'guide-5', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Fitness',
            title: "5 Essential Mobility Exercises Every Golfer Should Do Daily",
            excerpt: "Tour fitness trainers reveal the five exercises that improve rotation, prevent injury, and can add clubhead speed in just four weeks.",
            time: '5 days ago', image: IMG,
            content: `<p>Golf requires more athleticism than most people realize. These five exercises, recommended by PGA Tour fitness trainers, target the specific movements and muscles used in the golf swing.</p><p><strong>1. Open Book Thoracic Rotation (2 sets x 10 each side)</strong></p><p>Lie on your side with knees bent at 90 degrees. Extend both arms in front of you, then rotate your top arm open like a book, following with your eyes. Hold for two seconds at full rotation. This improves the thoracic spine mobility critical for a full backswing.</p><p><strong>2. 90/90 Hip Stretch (2 sets x 30 seconds each side)</strong></p><p>Sit with both legs bent at 90 degrees—one in front, one to the side. Lean your torso over your front shin, feeling the stretch in your front hip. Switch sides. This opens up the hips for better rotation and power transfer.</p><p><strong>3. Cat-Cow Spinal Flow (2 sets x 10 reps)</strong></p><p>On all fours, alternate between arching your back (cow) and rounding it (cat). Move slowly and breathe deeply. This lubricates the spinal joints and improves the flexibility needed for maintaining posture through the swing.</p><p><strong>4. World's Greatest Stretch (2 sets x 5 each side)</strong></p><p>From a lunge position, place your inside hand on the ground and rotate your outside hand to the sky. This single exercise stretches the hip flexors, hamstrings, thoracic spine, and shoulders simultaneously.</p><p><strong>5. Single-Leg Romanian Deadlift (2 sets x 8 each side)</strong></p><p>Standing on one leg, hinge forward at the hips while extending the other leg behind you. This builds the glute strength and balance essential for a stable, powerful golf swing.</p>`
        },
        {
            id: 'guide-6', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Mental Game',
            title: "Staying Calm Under Pressure: A Tour Sport Psychologist's Guide",
            excerpt: "Dr. Bob Rotella's proven techniques for managing nerves, staying present, and performing your best when it matters most.",
            time: '6 days ago', image: IMG,
            content: `<p>Pressure is the single biggest performance killer in golf. Sports psychologist Dr. Bob Rotella, who has worked with Rory McIlroy, Padraig Harrington, and countless other tour professionals, shares his core principles for thriving under pressure.</p><p><strong>1. Embrace the Butterflies</strong></p><p>Nerves are not your enemy—they're your body preparing to perform. Instead of trying to eliminate anxiety, reframe it as excitement. Tell yourself "I'm excited" rather than "I'm nervous." Studies show this simple reframe improves performance measurably.</p><p><strong>2. Focus on Process, Not Outcome</strong></p><p>When the pressure mounts, your mind naturally drifts to outcomes: "What if I slice it out of bounds?" Replace outcome thinking with process thinking: "I'm going to make a smooth takeaway and trust my swing." Have a specific swing thought for pressure situations.</p><p><strong>3. Breathe with Purpose</strong></p><p>Before every shot, take one deep breath: inhale for four counts, hold for two, exhale for six. This activates your parasympathetic nervous system and lowers your heart rate. Tour pros do this instinctively—you should make it deliberate.</p><p><strong>4. Commit Fully to Every Shot</strong></p><p>"Indecision is the biggest killer in golf," says Dr. Rotella. "Pick your target, pick your club, and commit 100%. A fully committed swing at the wrong target is better than a half-hearted swing at the right one."</p>`
        },
        {
            id: 'guide-7', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Beginners',
            title: "Golf for Beginners: A Complete Guide to Getting Started the Right Way",
            excerpt: "Everything a new golfer needs to know—from equipment basics and grip fundamentals to course etiquette and your first lesson plan.",
            time: '1 week ago', image: IMG,
            content: `<p>Welcome to golf! This guide covers everything you need to know to start your golf journey on the right foot, from essential equipment to on-course etiquette.</p><p><strong>Essential Equipment to Start:</strong></p><p>You don't need a full 14-club set. Start with these seven clubs: a driver, a 5-wood, 7-iron, 9-iron, pitching wedge, sand wedge, and putter. A quality used set from a reputable brand will cost $200-400 and serve you perfectly as you learn.</p><p><strong>The Grip:</strong></p><p>Hold the club in your fingers, not your palms. Place the club diagonally across the fingers of your left hand (for right-handers), then wrap your right hand over it with the right pinky overlapping the left index finger. Grip pressure should be 4 out of 10—firm enough to control the club, but light enough to allow wrist hinge.</p><p><strong>The Setup:</strong></p><p>Stand with feet shoulder-width apart, slight bend in the knees, and tilt from the hips so your arms hang naturally. The ball position varies by club: off the front heel for a driver, center of stance for short irons.</p><p><strong>Course Etiquette Essentials:</strong></p><p>Keep pace with the group ahead. Repair your divots and ball marks. Don't walk in other players' putting lines. Remain quiet and still when others are hitting. These simple courtesies will make you welcome on any course.</p>`
        },
        {
            id: 'guide-8', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Short Game',
            title: "Bunker Basics: How to Escape Greenside Sand Traps Every Time",
            excerpt: "Stop fearing the sand. Master this simple technique and you'll splash out of bunkers consistently, often closer to the pin than a chip.",
            time: '1 week ago', image: IMG,
            content: `<p>The greenside bunker shot is the only shot in golf where you don't actually hit the ball. Understanding this concept is the key to conquering your sand phobia.</p><p><strong>Setup:</strong> Open the clubface of your sand wedge significantly—the face should point at the sky. Dig your feet into the sand for stability and open your stance so your body aims 20-30 degrees left of the target. Position the ball forward in your stance, off your front heel.</p><p><strong>The Swing:</strong> Swing along your body line (left of target), entering the sand about two inches behind the ball. The club never touches the ball—instead, a cushion of sand launches the ball out. Accelerate through the sand with confidence; the number one error amateurs make is decelerating.</p><p><strong>The Key Feel:</strong> Imagine that the ball is sitting on a dollar bill in the sand. Your goal is to extract the entire dollar bill. This mental image ensures you take the right amount of sand—not too much, not too little.</p><p><strong>Distance Control:</strong> Don't change your swing speed to control distance. Instead, vary how open the face is: more open for shorter shots, less open for longer ones. Your swing should always be aggressive and committed.</p>`
        },
        {
            id: 'guide-9', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Putting',
            title: "Reading Greens Like a Pro: The Art and Science of Putt Alignment",
            excerpt: "Tiger Woods' former putting coach reveals the systematic approach to reading greens that separates tour players from amateurs.",
            time: '1 week ago', image: IMG,
            content: `<p>Green reading is a skill that separates good putters from great ones. Here's the systematic approach used by tour professionals to decode every green.</p><p><strong>Step 1: The Big Picture (Walk to the lowest point)</strong></p><p>Before reading your specific putt, identify the overall slope of the green. Water runs downhill, so find the lowest point—this tells you the dominant break direction. Most greens drain away from the highest point of the course.</p><p><strong>Step 2: Read from Behind the Hole</strong></p><p>Walk to a point about 10 feet behind the hole on an extension of your putting line. Crouch down and look back toward your ball. This reverse view often reveals break that's invisible from behind the ball, especially on the second half of the putt where speed is dying and break has maximum effect.</p><p><strong>Step 3: Read from the Low Side</strong></p><p>Stand on the low side of the putt, midway between ball and hole. From this angle, you can see the true slope most clearly. If the ground tilts toward you, the putt breaks toward you. This is your "confirmation read."</p><p><strong>Step 4: Trust Your Feet</strong></p><p>As you walk around the hole, pay attention to what your feet tell you about the slope. Your body's balance sensors are remarkably accurate at detecting subtle grade changes that your eyes might miss.</p>`
        },
        {
            id: 'guide-10', type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: 'Driving',
            title: "Increase Your Clubhead Speed by 10 MPH with These Overspeed Drills",
            excerpt: "Overspeed training is the scientifically proven method for gaining distance. Here's a safe, effective protocol any golfer can follow.",
            time: '2 weeks ago', image: IMG,
            content: `<p>Overspeed training works by retraining your neuromuscular system to move faster. Studies show that golfers can gain 5-10 mph of clubhead speed with a consistent 6-week protocol. Here's how to do it safely and effectively.</p><p><strong>What You Need:</strong> Three alignment sticks of different weights—one light (regular stick), one medium (stick with small weight), and one heavy (stick with larger weight). Commercial options like SuperSpeed Golf sticks are ideal.</p><p><strong>The Protocol (3 sessions per week, 15 minutes each):</strong></p><p>Set 1: Light stick — 5 swings from your dominant side, 5 from your non-dominant side. Swing as fast as possible. Rest 30 seconds between swings.</p><p>Set 2: Medium stick — Same rep scheme. Focus on maintaining proper sequencing (hips, torso, arms, hands) even at maximum speed.</p><p>Set 3: Heavy stick — Same rep scheme. This builds strength-specific power. Don't try to match the speed of the lighter sticks.</p><p>Set 4: Your driver — Hit 5 swings, focusing on applying your new speed to a real club.</p><p><strong>Important:</strong> Always warm up before overspeed training. Start each session with 20 practice swings at moderate speed. If you feel any pain or discomfort, stop immediately. Results typically appear within 3-4 weeks of consistent training.</p>`
        },
        {
            id: 'course-1', type: 'REGULAR', category: 'COURSES', categoryTag: 'Scotland',
            title: "St Andrews Old Course: The Home of Golf – Complete Guide & Review",
            excerpt: "A comprehensive guide to playing the most famous golf course in the world, including tips for the ballot system, best holes, and local knowledge.",
            time: '1 week ago', image: IMG,
            content: `<p>The Old Course at St Andrews needs no introduction. Dating back to the 15th century, it is the birthplace of golf and the most iconic links course on the planet. Walking these fairways is a pilgrimage every golfer should make at least once.</p><p><strong>The Course:</strong> At 7,305 yards from the championship tees, the Old Course plays as a par 72 with enormous double greens that are shared between outgoing and incoming holes. The fairways are wide, but the hidden pot bunkers—over 100 of them—are the course's primary defense. Local knowledge is essential.</p><p><strong>Signature Holes:</strong> The Road Hole (17th) is considered the hardest par 4 in the world, with its blind tee shot over the Old Course Hotel and the infamous Road Hole bunker guarding the front-left of the green. The 1st and 18th share the widest fairway in golf but are surrounded by history and pressure.</p><p><strong>How to Play:</strong> Public access is available through the daily ballot system. Register online at least two days in advance. Green fees are £295 in peak season. The course is closed on Sundays, maintaining a tradition dating back centuries.</p><p><strong>Local Tips:</strong> Hire a local caddie—they know every ridge, hollow, and hidden bunker. Play the course conservatively on your first visit; the real challenge isn't length but navigation. And don't miss the Jigger Inn beside the 17th for a post-round pint.</p>`
        },
        {
            id: 'course-2', type: 'REGULAR', category: 'COURSES', categoryTag: 'Scotland',
            title: "Royal Dornoch Golf Club: Scotland's Hidden Jewel in the Highlands",
            excerpt: "Often ranked among the top five courses in the world, Royal Dornoch offers a sublime links experience far from the crowds of St Andrews.",
            time: '1 week ago', image: IMG,
            content: `<p>Royal Dornoch, nestled on the Dornoch Firth in the Scottish Highlands, is one of the most revered golf courses in the world. Tom Watson once said, "This is the most fun I've ever had on a golf course," and it's easy to see why.</p><p><strong>The Course:</strong> The Championship Course measures 6,726 yards and plays as a par 70. It's a classic out-and-back links layout along the shores of the North Sea, with natural dunes framing every hole. The turf is among the finest in Scotland—springy, firm, and perfect for links golf.</p><p><strong>What Makes It Special:</strong> The raised, plateau greens are Royal Dornoch's calling card. These elevated putting surfaces reject anything but the most precisely struck approach shots. Miss the green, and you're faced with a fiendishly difficult chip from a tight lie below the putting surface.</p><p><strong>Best Holes:</strong> The 2nd hole is a stunning par 3 played to an elevated green framed by gorse and the sea beyond. The 14th, called "Foxy," is a 445-yard par 4 that doglegs left around a massive dune—no bunkers, yet one of the most strategically demanding holes in golf.</p><p><strong>Visitor Info:</strong> Green fees are £235 in peak season. Unlike St Andrews, tee times are generally available with advance booking. The town of Dornoch itself is charming, with excellent accommodation at the Royal Golf Hotel.</p>`
        },
        {
            id: 'course-3', type: 'REGULAR', category: 'COURSES', categoryTag: 'USA',
            title: "Pebble Beach Golf Links: Where the Mountains Meet the Pacific",
            excerpt: "America's greatest public golf course delivers an unforgettable experience along the stunning Monterey Peninsula coastline.",
            time: '2 weeks ago', image: IMG,
            content: `<p>Pebble Beach Golf Links is simply one of the most beautiful places on earth to play golf. Perched on the cliffs of the Monterey Peninsula, with the Pacific Ocean crashing below, it's a course that takes your breath away at every turn.</p><p><strong>The Course:</strong> Playing at 6,828 yards from the blue tees, Pebble Beach is a par 72 that winds along the coastline. Eight holes play directly along the ocean, offering views that no photograph can fully capture. The finishing stretch from the 6th through the 10th is the finest run of holes in American golf.</p><p><strong>Signature Holes:</strong> The par-3 7th (107 yards) is the shortest on the PGA Tour, playing downhill to a tiny green perched on a rocky outcrop above the Pacific. The 18th is one of golf's great finishing holes—a par 5 that curves along the entire length of Carmel Bay.</p><p><strong>Playing Tips:</strong> The greens are small and firm. Approach shots that land short and run up are far more effective than high, spinning iron shots. Wind can be a major factor, especially in the afternoon when the ocean breeze picks up. Club selection is critical.</p><p><strong>Visitor Info:</strong> Green fees are $625, with resort guests receiving preferred tee times. The experience is worth every penny. Book well in advance—tee times sell out months ahead. Consider staying at The Lodge at Pebble Beach for the full experience.</p>`
        },
        {
            id: 'course-4', type: 'REGULAR', category: 'COURSES', categoryTag: 'USA',
            title: "Pinehurst No. 2: The Crown Jewel of American Golf Architecture",
            excerpt: "Donald Ross's masterpiece in the North Carolina Sandhills offers a relentless test of accuracy and short-game skill.",
            time: '2 weeks ago', image: IMG,
            content: `<p>Pinehurst No. 2, restored to Donald Ross's original vision in 2011, is widely regarded as the finest test of golf in the United States. The course doesn't overpower you with length—instead, it tests your precision, creativity, and especially your short game.</p><p><strong>The Course:</strong> At 7,588 yards from the championship tees, No. 2 plays as a par 72 through the stunning longleaf pine forests of the North Carolina Sandhills. The native wire grass and sandy waste areas that frame the fairways give the course a ruggedly beautiful appearance.</p><p><strong>The Greens:</strong> The crowned, convex greens are No. 2's greatest defense. They resemble inverted saucers, repelling anything that doesn't land in the center. Miss a green, and you're left with one of golf's most difficult recovery shots—a delicate pitch from tight hardpan to a green that runs away from you.</p><p><strong>Ross's Philosophy:</strong> Donald Ross believed that a poor shot should be penalized proportionally to its degree of error. At No. 2, a slightly offline approach may leave a difficult putt; a badly missed approach will roll 30 yards off the green into a sandy hollow. It's golf design at its finest.</p>`
        },
        {
            id: 'course-5', type: 'REGULAR', category: 'COURSES', categoryTag: 'England',
            title: "Royal Birkdale: England's Finest Championship Links Course",
            excerpt: "Set among towering sand dunes on England's Lancashire coast, Royal Birkdale has hosted more Open Championships than almost any other venue.",
            time: '2 weeks ago', image: IMG,
            content: `<p>Royal Birkdale Golf Club, located on the Lancashire coast in Southport, England, is one of the premier championship venues in the world. It has hosted ten Open Championships, producing winners who represent golf's greatest names: Peter Thomson, Arnold Palmer, Tom Watson, Johnny Miller, and most recently, Jordan Spieth.</p><p><strong>The Course:</strong> At 7,156 yards, Royal Birkdale plays as a par 72 through dramatic sand dunes that tower above the fairways. Unlike many links courses, Birkdale's holes are set in valleys between dunes, meaning the wind can be less of a factor than at more exposed venues—though it remains a formidable test.</p><p><strong>Design Excellence:</strong> The routing is considered one of the fairest in championship golf. There are no blind shots, no unfair bounces into disaster. Every challenge is visible and honest, which is why the R&A and PGA of America consistently return major championships here.</p><p><strong>Must-Play Holes:</strong> The 12th is a 183-yard par 3 to a beautifully framed green nestled among dunes. The closing stretch from 15 through 18 is as demanding as any finish in Open Championship golf, with the 18th requiring a precise drive between bunkers to set up an approach to an elevated green.</p>`
        },
        {
            id: 'course-6', type: 'REGULAR', category: 'COURSES', categoryTag: 'Spain',
            title: "Valderrama Golf Club: Europe's Premier Championship Course",
            excerpt: "Home of the 1997 Ryder Cup, Valderrama remains the jewel of Continental European golf with its immaculate conditioning and demanding layout.",
            time: '3 weeks ago', image: IMG,
            content: `<p>Valderrama Golf Club in Sotogrande, southern Spain, is widely regarded as the finest golf course in continental Europe. Its immaculate conditioning, strategic design, and storied championship history make it a must-play for serious golfers visiting the Iberian Peninsula.</p><p><strong>The Course:</strong> Designed by Robert Trent Jones Sr. and measuring 6,951 yards from the back tees, Valderrama plays as a par 71 through a stunning cork oak forest. The fairways are lined with ancient trees that frame each hole beautifully while demanding precise tee shots.</p><p><strong>The Signature Hole:</strong> The par-5 4th is Valderrama's most famous and feared hole. At 563 yards, it plays sharply downhill before requiring a daring approach to a green guarded by water on the left. During the 1997 Ryder Cup, this hole produced more drama than any other on the course.</p><p><strong>Course Condition:</strong> Valderrama's conditioning is legendary. The club employs one of the largest greenkeeping staffs in Europe, and it shows—the fairways, greens, and bunkers are maintained to standards that rival Augusta National.</p><p><strong>Visitor Info:</strong> Green fees are €350 in peak season. A handicap certificate is required (maximum 24 for men, 28 for women). Book well in advance as visitor slots are limited.</p>`
        },
        {
            id: 'course-7', type: 'REGULAR', category: 'COURSES', categoryTag: 'Portugal',
            title: "Monte Rei North Course: The Algarve's Crown Jewel by Jack Nicklaus",
            excerpt: "Jack Nicklaus designed Monte Rei to be the best course in Portugal—and it delivers with spectacular views and world-class conditioning.",
            time: '3 weeks ago', image: IMG,
            content: `<p>Monte Rei's North Course, designed by Jack Nicklaus, has rapidly established itself as the number one ranked golf course in Portugal. Located in the eastern Algarve near Tavira, it offers a golf experience that rivals anything in Europe.</p><p><strong>The Course:</strong> Playing at 7,171 yards from the championship tees, Monte Rei is a par 72 that flows through the rolling hills of the Algarve countryside with panoramic views of the Atlantic Ocean and the mountains of the Serra do Caldeirão. Nicklaus crafted each hole to take maximum advantage of the dramatic terrain.</p><p><strong>Design Philosophy:</strong> True to Nicklaus's design principles, Monte Rei offers multiple routes on every hole. Wide fairways invite aggressive play, but strategic bunkering and water features reward careful positioning. The greens are large and subtly contoured, setting up fascinating putting puzzles.</p><p><strong>Conditioning:</strong> Monte Rei's conditioning is extraordinary. The Bermuda grass fairways provide perfect lies year-round, and the bentgrass greens are maintained to tour standards. The attention to detail extends to the practice facilities, which include a stunning short-game area overlooking the 18th fairway.</p>`
        },
        {
            id: 'course-8', type: 'REGULAR', category: 'COURSES', categoryTag: 'Florida',
            title: "TPC Sawgrass: The Stadium Course That Changed Golf Course Design",
            excerpt: "Home of The Players Championship, TPC Sawgrass features the most famous par 3 in golf and a layout that rewards precision over power.",
            time: '3 weeks ago', image: IMG,
            content: `<p>TPC Sawgrass in Ponte Vedra Beach, Florida, is one of the most recognized golf courses in the world, thanks largely to its iconic par-3 17th hole with its island green. But there's far more to this Pete Dye masterpiece than a single hole.</p><p><strong>The Course:</strong> The Stadium Course plays at 7,245 yards as a par 72. Pete Dye designed it specifically for spectator viewing, with mounding and amphitheater-style seating around greens and tee boxes. But don't let the "stadium" label fool you—this is a brutally difficult golf course that demands precision on every shot.</p><p><strong>The Island Green (17th):</strong> The 137-yard par 3 to an island green is the most photographed and discussed hole in golf. During The Players Championship week, approximately 100,000 balls find the water surrounding this tiny, 4,608-square-foot putting surface. Wind, nerves, and the all-or-nothing nature of the target make it the ultimate pressure shot.</p><p><strong>Playing Strategy:</strong> The key to scoring at TPC Sawgrass is course management. Dye designed many holes with risk-reward options off the tee—players who position their drives carefully will find manageable approaches, while those who overextend will find thick rough, water, and treacherous bunkers.</p>`
        },
    ];

    // 2. Generate 70 Guides
    let categoryGuides = await prisma.category.findFirst({ where: { OR: [{ slug: 'guides-tips' }, { slug: 'how-to' }] } });
    if (!categoryGuides) {
        categoryGuides = await prisma.category.create({ data: { name: 'Guides & Tips', slug: 'guides-tips' } });
    }

    // Ensure Guide Tags
    for (const tag of GUIDE_CATEGORY_TAGS) {
        await prisma.subTag.upsert({
            where: { id: `tag-guide-${tag}` }, // Using a key might fail if ID is uuid, so better check first or rely on standard create
            update: {},
            create: { name: tag, categoryId: categoryGuides.id }
            // Note: standard upsert needs unique field. name is not unique globally, but we can check existing.
            // Simplified:
        }).catch(() => { });
        // Actually, let's just create if not exists using findFirst
        const exists = await prisma.subTag.findFirst({ where: { name: tag, categoryId: categoryGuides.id } });
        if (!exists) await prisma.subTag.create({ data: { name: tag, categoryId: categoryGuides.id } });
    }

    const newGuides: any[] = [];
    for (let i = 11; i <= 80; i++) {
        const tag = GUIDE_CATEGORY_TAGS[i % GUIDE_CATEGORY_TAGS.length];
        newGuides.push({
            id: `guide-${i}`, type: 'REGULAR', category: 'GUIDES-TIPS', categoryTag: tag,
            title: `Golf Guide ${i}: Mastering the ${tag} - Essential Tips`,
            excerpt: `Learn the secrets of ${tag} with this comprehensive guide (Article ${i}). Improve your game with these expert tips.`,
            time: 'Just now', image: IMG,
            content: `<p>In this guide, we explore the nuances of <strong>${tag}</strong>.</p><p>Mastering this aspect is crucial.</p>`,
            publishedAt: new Date(),
            categoryId: categoryGuides.id
        });
    }

    // 3. Generate 70 Course Reviews
    let categoryCourses = await prisma.category.findFirst({ where: { slug: 'courses' } });
    if (!categoryCourses) {
        categoryCourses = await prisma.category.create({ data: { name: 'Courses', slug: 'courses' } });
    }

    // Ensure Course Tags
    for (const loc of COURSE_LOCATIONS) {
        const exists = await prisma.subTag.findFirst({ where: { name: loc, categoryId: categoryCourses.id } });
        if (!exists) await prisma.subTag.create({ data: { name: loc, categoryId: categoryCourses.id } });
    }

    const newCourses: any[] = [];
    for (let i = 1; i <= 70; i++) {
        const location = COURSE_LOCATIONS[i % COURSE_LOCATIONS.length];
        newCourses.push({
            id: `course-review-${i}`, type: 'REGULAR', category: 'COURSES', categoryTag: location,
            title: `Course Review ${i}: The Hidden Gem of ${location}`,
            excerpt: `Discover why this course in ${location} is a must-play. A comprehensive review of the layout, conditions, and experience (Review ${i}).`,
            time: 'Just now', image: IMG,
            content: `<p>In this review, we take a closer look at one of the finest courses in <strong>${location}</strong>.</p><p>Immaculate fairways and true-rolling greens make for a perfect day out.</p>`,
            publishedAt: new Date(),
            categoryId: categoryCourses.id
        });
    }


    const allData = [...newsData, ...newGuides, ...newCourses];

    console.log(`Upserting ${allData.length} articles...`);
    for (const news of allData) {
        await prisma.news.upsert({
            where: { id: news.id },
            update: news,
            create: news,
        });
    }

    // Default Site Settings
    const settings = [
        { key: 'site_name', value: 'The Golf Press', type: 'text' },
        { key: 'site_description', value: 'The definitive voice in golf, delivering real-time scores, expert instruction, and premium news.', type: 'text' },
        { key: 'contact_email_editorial', value: 'editor@thegolfpress.com', type: 'email' },
        { key: 'contact_email_ads', value: 'ads@thegolfpress.com', type: 'email' },
        { key: 'social_instagram', value: 'https://instagram.com/thegolfpress', type: 'url' },
        { key: 'social_twitter', value: 'https://twitter.com/thegolfpress', type: 'url' },
        { key: 'social_facebook', value: 'https://facebook.com/thegolfpress', type: 'url' },
    ];

    for (const setting of settings) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: {},
            create: setting
        });
    }

    console.log(`Seeding finished. All data populated.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
